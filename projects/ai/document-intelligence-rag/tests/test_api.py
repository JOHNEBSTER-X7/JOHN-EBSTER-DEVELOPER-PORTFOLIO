import io

import pytest
from fastapi.testclient import TestClient

from app import main


@pytest.fixture()
def client(tmp_path, monkeypatch):
    monkeypatch.setattr(main, "DATA_DIR", tmp_path)
    monkeypatch.setattr(main, "UPLOAD_DIR", tmp_path / "uploads")
    monkeypatch.setattr(main, "DB_PATH", tmp_path / "test.sqlite3")
    return TestClient(main.app)


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_split_text_overlap_and_empty():
    chunks = main.split_text("alpha beta gamma delta epsilon", size=15, overlap=3)
    assert len(chunks) >= 2
    assert main.split_text("  ") == []


def test_split_text_rejects_invalid_parameters():
    with pytest.raises(ValueError):
        main.split_text("hello", size=5, overlap=5)


def test_upload_and_list_text_document(client):
    response = client.post("/documents", files={"file": ("guide.txt", b"Risk management requires clear controls.", "text/plain")})
    assert response.status_code == 201
    document = response.json()
    assert document["chunks_indexed"] == 1
    listed = client.get("/documents").json()
    assert listed[0]["filename"] == "guide.txt"


def test_ask_returns_cited_retrieved_passage(client):
    client.post("/documents", files={"file": ("policy.md", b"Access control requires strong authentication and least privilege.", "text/markdown")})
    result = client.post("/ask", json={"question": "What does access control require?"})
    assert result.status_code == 200
    assert "least privilege" in result.json()["answer"]
    assert result.json()["sources"][0]["citation"] == "[1]"


def test_ask_handles_no_match(client):
    result = client.post("/ask", json={"question": "quantum banana"})
    assert result.status_code == 200
    assert result.json()["sources"] == []


def test_reject_unsupported_file(client):
    result = client.post("/documents", files={"file": ("payload.exe", b"no", "application/octet-stream")})
    assert result.status_code == 415


def test_delete_document(client):
    uploaded = client.post("/documents", files={"file": ("notes.txt", b"Important meeting notes.", "text/plain")}).json()
    deleted = client.delete(f"/documents/{uploaded['id']}")
    assert deleted.status_code == 204
    assert client.get("/documents").json() == []


def test_upload_rejects_empty_file(client):
    result = client.post("/documents", files={"file": ("empty.txt", b"", "text/plain")})
    assert result.status_code == 400
