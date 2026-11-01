# Interview guide — Market Intelligence API

## Explain the architecture

FastAPI exposes REST endpoints. Pydantic models validate and document data. A deterministic scoring function produces an explainable ranking. The optional LLM endpoint is isolated from the core ranking path so the API remains useful without credentials.

## Explain the scoring

The score is the weighted sum of three normalised components:
- Demand mentions: up to 40 points.
- Urgency: up to 30 points.
- Competitive whitespace: up to 30 points, with lower competition receiving more points.

It is intentionally a heuristic, not a trained model. The sample data is synthetic.

## Discuss trade-offs

- In-memory data keeps the exercise simple but loses updates on restart.
- A database and migrations would be needed for persistence.
- The optional LLM call can fail, cost money and return untrusted output; production systems need timeouts, usage limits, retries and output evaluation.
- Source provenance and evidence quality are essential before calling signals real market intelligence.

## Next improvements

1. Add PostgreSQL persistence and Alembic migrations.
2. Add authentication and role-based access.
3. Add source adapters with permission-aware collection.
4. Add deduplication and confidence/provenance fields.
5. Add pagination, structured logging and rate limits.
6. Add integration tests with a temporary database.
