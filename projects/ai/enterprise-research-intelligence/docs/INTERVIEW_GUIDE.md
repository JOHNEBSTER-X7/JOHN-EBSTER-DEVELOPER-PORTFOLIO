# Interview guide

## 60-second explanation

I built an enterprise research workspace combining optional web search with user-uploaded documents. It ingests PDF and text content, chunks and indexes it, retrieves relevant passages, builds a source register and generates an exportable Markdown report. The report identifies evidence gaps and distinguishes retrieval relevance from source credibility. If no sources are available, it returns an insufficient-evidence status rather than inventing research.

## Questions to prepare for

**How does it collect sources?** An optional Tavily adapter returns search result titles, URLs, excerpts and provider relevance scores. A local retriever searches uploaded document chunks.

**What does relevance mean?** It is a retrieval signal, not a credibility or truth score. A production system should separately evaluate publisher authority, date, primary-source status and corroboration.

**Why include insufficient evidence?** It prevents unsupported claims and makes the evidence boundary explicit.

**How would you improve retrieval?** Add embeddings and a vector store, query rewriting, hybrid search, reranking and a labelled evaluation dataset.

**How would you make it production-ready?** Add durable storage, authentication, tenant isolation, encryption, document scanning, OCR, retention policies, audit logs and citation verification.

**How would you assess quality?** Measure retrieval precision/recall, source coverage, citation correctness, freshness and human reviewer agreement on a benchmark of research questions.
