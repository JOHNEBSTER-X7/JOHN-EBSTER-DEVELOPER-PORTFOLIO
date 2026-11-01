# Market Intelligence API

A small, testable FastAPI service that stores an illustrative sample of market-demand signals, ranks them with an explainable heuristic, filters by category and optionally summarises a signal with an OpenAI model.

## What it demonstrates

- Python 3.12 and FastAPI REST API design.
- Pydantic models and response schemas.
- Filtering, ranking, validation and HTTP error handling.
- Explainable scoring rather than opaque ranking.
- Optional LLM integration with a local fallback.
- Pytest API tests and GitHub Actions CI.
- Containerisation with Docker.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for the interactive API documentation.

## Run tests

```bash
pytest -q
```

**Local verification:** `7 passed` using Python 3.13 in the development environment on 1 November 2026. GitHub Actions is configured to run the suite on Python 3.12.

## Optional LLM summaries

Copy `.env.example` to `.env`, set `OPENAI_API_KEY`, then export the variables in your shell before starting the API. Never commit `.env` or expose API keys in screenshots or logs.

Without an API key, the summary endpoint returns a local fallback. The LLM endpoint uses `OPENAI_MODEL` (default `gpt-4.1-mini`).

## Docker

```bash
docker build -t market-intelligence-api .
docker run --rm -p 8000:8000 market-intelligence-api
```

## Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/signals` | Ranked signals; supports `category` and `min_score` |
| GET | `/signals/{signal_id}` | One signal |
| POST | `/signals/{signal_id}/summary` | Optional LLM summary |

Example:

```bash
curl 'http://127.0.0.1:8000/signals?category=ai'
```

## Data and limitations

The included records are synthetic examples for demonstration, not scraped or verified market observations. The score is a transparent heuristic based on mention count, urgency and competition. It is not a statistically validated forecast, investment recommendation or proof of customer demand. A production version would require source connectors, deduplication, timestamps, provenance, user authentication, persistence, rate limiting, observability and human review.
