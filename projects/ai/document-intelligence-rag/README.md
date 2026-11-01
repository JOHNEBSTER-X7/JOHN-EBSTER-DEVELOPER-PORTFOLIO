# Northstar Document Intelligence — RAG

A document-grounded knowledge assistant API built with Python and FastAPI. Upload PDF, TXT or Markdown documents, extract text, split it into overlapping chunks, index those chunks in SQLite, and retrieve relevant passages with document/page references.

## What it demonstrates

- FastAPI REST API design and request validation.
- PDF and text extraction, chunking and persistent indexing.
- Transparent lexical retrieval with source references.
- SQLite persistence and document lifecycle management.
- Upload validation, size limits and automated tests.
- Container packaging and GitHub Actions CI.

## Current retrieval behaviour

This first release is deliberately **retrieval-first**, not a pretend LLM chatbot. It ranks document chunks using token overlap and returns the exact supporting passages with citations such as a filename, PDF page and chunk number. The baseline does not use vector embeddings and does not generate a model-written answer. This makes its behaviour deterministic and testable while providing a foundation for a later embedding/vector-search and grounded-generation adapter.

## Run locally

Requires Python 3.11 or later.

```bash
cd projects/ai/document-intelligence-rag
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000/docs for the interactive API documentation.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/documents` | Upload and index a PDF, TXT or MD file |
| GET | `/documents` | List indexed documents |
| DELETE | `/documents/{id}` | Delete a document and its chunks |
| POST | `/ask` | Retrieve relevant passages for a question |

Example question:

```json
{"question":"What does the policy say about access control?","top_k":5}
```

## Tests

```bash
pytest -q
```

The test suite covers health, chunking, upload, listing, retrieval citations, no-match behaviour, validation and deletion.

## Configuration and limits

- Maximum upload size: 10 MB.
- Supported file types: PDF, TXT and Markdown.
- PDF extraction is text-based; scanned/image-only PDFs need OCR, which is not included.
- Retrieval is lexical and will not understand synonyms as well as semantic embeddings.
- No authentication, tenant isolation, malware scanning, rate limiting or encryption-at-rest layer is included. Do not expose this prototype to the public internet or upload confidential, regulated or personal documents.
- Uploaded files and the SQLite database are stored locally. Backups, retention policies and production storage are not implemented.
- This is an engineering portfolio prototype, not a compliance-certified document management product.

## Next engineering milestones

1. Add OCR for scanned PDFs.
2. Add embedding generation and a pluggable vector store.
3. Add an optional LLM answer adapter with strict context-only prompting and citation validation.
4. Add authentication, tenant isolation, audit logs and secure object storage.
5. Add evaluation datasets for retrieval precision/recall and answer faithfulness.

## Licence

MIT. See the repository-level licence.
