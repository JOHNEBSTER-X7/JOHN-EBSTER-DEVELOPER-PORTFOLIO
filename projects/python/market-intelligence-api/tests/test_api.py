from fastapi.testclient import TestClient
from app.main import app, score_signal, SIGNALS

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_signals_are_ranked_highest_first():
    response = client.get("/signals")
    assert response.status_code == 200
    scores = [item["score"] for item in response.json()]
    assert scores == sorted(scores, reverse=True)

def test_category_filter():
    response = client.get("/signals?category=web3")
    assert response.status_code == 200
    assert all(item["category"] == "web3" for item in response.json())

def test_invalid_category_is_rejected():
    response = client.get("/signals?category=unknown")
    assert response.status_code == 400

def test_missing_signal_is_404():
    response = client.get("/signals/not-real")
    assert response.status_code == 404

def test_summary_has_local_fallback_without_key(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    response = client.post("/signals/sig-001/summary")
    assert response.status_code == 200
    assert response.json()["mode"] == "local-fallback"

def test_score_is_bounded_and_explained():
    score, explanation = score_signal(SIGNALS[0])
    assert 0 <= score <= 100
    assert "Demand contributes" in explanation
