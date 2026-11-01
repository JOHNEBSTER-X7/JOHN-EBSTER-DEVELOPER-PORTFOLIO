# Interview guide

## Explain the project in 60 seconds

I built a FastAPI document intelligence service that accepts PDF and text-based documents, extracts and chunks their content, persists the chunks in SQLite, and retrieves relevant passages for user questions. It returns explicit source references rather than claiming that a language model generated a verified answer. The retrieval layer is intentionally simple and replaceable, making the next step—embeddings and vector search—easy to isolate.

## Questions to prepare for

**Why chunk documents?** Long documents are difficult to retrieve as a single unit. Chunks provide smaller evidence passages and allow the system to return focused context. Overlap reduces the chance that a sentence split at a boundary loses important context.

**Why SQLite?** It removes infrastructure friction for a reproducible portfolio demo. A larger deployment could move metadata to PostgreSQL and use a dedicated vector database or pgvector.

**Is this semantic search?** No. The current baseline uses token overlap. It is transparent and deterministic but weak on synonyms and paraphrases. Embeddings are a planned extension, not an existing feature.

**How are citations produced?** Each stored chunk retains its document ID, filename, optional PDF page and chunk index. Retrieval returns those identifiers alongside the text.

**What would you change for production?** Authentication, tenant-level authorisation, secure object storage, malware scanning, encryption, audit events, deletion/retention policies, rate limiting, monitoring, OCR, embedding evaluation and grounded-generation safeguards.

**How would you evaluate it?** Build a labelled query/document dataset, measure recall@k and precision@k, test citation correctness, and separately evaluate generated-answer faithfulness if an LLM adapter is introduced.
