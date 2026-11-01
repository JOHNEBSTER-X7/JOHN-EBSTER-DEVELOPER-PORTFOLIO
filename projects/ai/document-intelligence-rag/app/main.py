from __future__ import annotations

import os
import re
import sqlite3
import uuid
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel, Field

try:
    from pypdf import PdfReader
except ImportError:  # pragma: no cover - dependency is declared
    PdfReader = None

APP_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.getenv("RAG_DATA_DIR", APP_DIR.parent / "data"))
UPLOAD_DIR = DATA_DIR / "uploads"
DB_PATH = Path(os.getenv("RAG_DB_PATH", DATA_DIR / "documents.sqlite3"))
MAX_FILE_BYTES = 10 * 1024 * 1024
CHUNK_SIZE = 900
CHUNK_OVERLAP = 120
ALLOWED_EXTENSIONS = {".txt", ".md", ".pdf"}

app = FastAPI(title="Northstar Document Intelligence API", version="1.0.0")


def connect() -> sqlite3.Connection:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY, filename TEXT NOT NULL, media_type TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    """)
    connection.execute("""
        CREATE TABLE IF NOT EXISTS chunks (
            id INTEGER PRIMARY KEY AUTOINCREMENT, document_id TEXT NOT NULL,
            page_number INTEGER, chunk_index INTEGER NOT NULL, content TEXT NOT NULL,
            FOREIGN KEY(document_id) REFERENCES documents(id) ON DELETE CASCADE
        )
    """)
    connection.commit()
    return connection


def split_text(text: str, size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    cleaned = re.sub(r"\s+", " ", text).strip()
    if not cleaned:
        return []
    if size <= 0 or overlap < 0 or overlap >= size:
        raise ValueError("Chunk size must be positive and overlap smaller than size")
    chunks = []
    start = 0
    while start < len(cleaned):
        end = min(start + size, len(cleaned))
        if end < len(cleaned):
            boundary = cleaned.rfind(" ", start + size // 2, end)
            if boundary > start:
                end = boundary
        piece = cleaned[start:end].strip()
        if piece:
            chunks.append(piece)
        if end >= len(cleaned):
            break
        start = max(end - overlap, start + 1)
    return chunks


def extract_file(filename: str, content: bytes) -> list[tuple[int | None, str]]:
    suffix = Path(filename).suffix.lower()
    if suffix in {".txt", ".md"}:
        try:
            return [(None, content.decode("utf-8-sig"))]
        except UnicodeDecodeError as exc:
            raise ValueError("Text files must use UTF-8 encoding") from exc
    if suffix == ".pdf":
        if PdfReader is None:
            raise ValueError("PDF support is unavailable")
        import io
        reader = PdfReader(io.BytesIO(content))
        return [(number, page.extract_text() or "") for number, page in enumerate(reader.pages, 1)]
    raise ValueError("Unsupported file type. Upload PDF, TXT or Markdown.")


def tokenise(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]{2,}", text.lower()))


def retrieve(question: str, limit: int = 5) -> list[dict[str, Any]]:
    query_terms = tokenise(question)
    if not query_terms:
        return []
    with connect() as db:
        rows = db.execute("""
            SELECT c.id, c.document_id, c.page_number, c.chunk_index, c.content,
                   d.filename
            FROM chunks c JOIN documents d ON d.id = c.document_id
        """).fetchall()
    ranked = []
    for row in rows:
        terms = tokenise(row["content"])
        overlap = len(query_terms & terms)
        if overlap:
            # Transparent lexical relevance baseline; not a learned embedding model.
            score = overlap / (len(query_terms) ** 0.5 * max(len(terms), 1) ** 0.25)
            ranked.append((score, row))
    ranked.sort(key=lambda item: (item[0], -item[1]["chunk_index"]), reverse=True)
    return [{
        "document_id": row["document_id"], "filename": row["filename"],
        "page": row["page_number"], "chunk": row["chunk_index"],
        "text": row["content"], "score": round(score, 4)
    } for score, row in ranked[:limit]]


class AskRequest(BaseModel):
    question: str = Field(min_length=3, max_length=2000)
    top_k: int = Field(default=5, ge=1, le=10)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "document-intelligence-rag"}


@app.post("/documents", status_code=201)
async def upload_document(file: UploadFile = File(...)) -> dict[str, Any]:
    filename = Path(file.filename or "").name
    suffix = Path(filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(415, "Only PDF, TXT and Markdown files are supported.")
    content = await file.read(MAX_FILE_BYTES + 1)
    if not content:
        raise HTTPException(400, "The uploaded file is empty.")
    if len(content) > MAX_FILE_BYTES:
        raise HTTPException(413, "File exceeds the 10 MB upload limit.")
    try:
        pages = extract_file(filename, content)
    except Exception as exc:
        raise HTTPException(400, str(exc)) from exc

    document_id = str(uuid.uuid4())
    prepared = []
    for page, text in pages:
        for index, chunk in enumerate(split_text(text)):
            prepared.append((document_id, page, index, chunk))
    if not prepared:
        raise HTTPException(422, "No extractable text was found in the document.")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    stored_path = UPLOAD_DIR / document_id
    stored_path.write_bytes(content)
    try:
        with connect() as db:
            db.execute("INSERT INTO documents(id, filename, media_type) VALUES (?, ?, ?)",
                       (document_id, filename, file.content_type or "application/octet-stream"))
            db.executemany(
                "INSERT INTO chunks(document_id, page_number, chunk_index, content) VALUES (?, ?, ?, ?)",
                prepared
            )
    except Exception:
        stored_path.unlink(missing_ok=True)
        raise
    return {"id": document_id, "filename": filename, "chunks_indexed": len(prepared)}


@app.get("/documents")
def list_documents() -> list[dict[str, Any]]:
    with connect() as db:
        rows = db.execute("""
            SELECT d.id, d.filename, d.media_type, d.created_at, COUNT(c.id) AS chunks
            FROM documents d LEFT JOIN chunks c ON c.document_id = d.id
            GROUP BY d.id ORDER BY d.created_at DESC
        """).fetchall()
    return [dict(row) for row in rows]


@app.delete("/documents/{document_id}", status_code=204)
def delete_document(document_id: str) -> None:
    with connect() as db:
        row = db.execute("SELECT id FROM documents WHERE id = ?", (document_id,)).fetchone()
        if row is None:
            raise HTTPException(404, "Document not found.")
        db.execute("DELETE FROM chunks WHERE document_id = ?", (document_id,))
        db.execute("DELETE FROM documents WHERE id = ?", (document_id,))
    (UPLOAD_DIR / document_id).unlink(missing_ok=True)


@app.post("/ask")
def ask(request: AskRequest) -> dict[str, Any]:
    sources = retrieve(request.question, request.top_k)
    if not sources:
        return {
            "answer": "I could not find relevant passages in the indexed documents. Try different terms or upload a relevant document.",
            "mode": "retrieval-only", "sources": []
        }
    # Safe deterministic baseline: quote retrieved evidence instead of fabricating a synthesis.
    excerpts = [
        f"[{i}] {source['filename']}"
        + (f", page {source['page']}" if source["page"] is not None else "")
        + f": {source['text']}"
        for i, source in enumerate(sources, 1)
    ]
    return {
        "answer": "Relevant passages found in your documents:\n\n" + "\n\n".join(excerpts),
        "mode": "retrieval-only",
        "notice": "This baseline retrieves evidence; it does not generate a model-written answer.",
        "sources": [
            {"citation": f"[{i}]", "document_id": s["document_id"],
             "filename": s["filename"], "page": s["page"],
             "chunk": s["chunk"], "score": s["score"]}
            for i, s in enumerate(sources, 1)
        ]
    }
