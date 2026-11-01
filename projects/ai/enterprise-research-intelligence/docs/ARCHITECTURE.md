# Architecture

## Request flow

1. User submits a research question.
2. Search adapter calls Tavily when an API key is configured.
3. Document retriever searches previously uploaded text/PDF passages.
4. Results are deduplicated and limited to a bounded source set.
5. Theme extraction identifies query terms present in source text.
6. Report builder creates evidence excerpts, source register, gaps and validation steps.
7. Client can inspect and export the report.

## Ingestion

Multer enforces a configurable upload limit. TXT/Markdown are decoded as UTF-8; PDF text is extracted with pdf-parse. Extracted text is normalised, divided into overlapping chunks and held in a process-local collection. Retrieval uses token overlap.

## Evidence model

Each source records an identifier, title, URL or document URI, excerpt, source type and relevance score. Scores are retrieval metadata only. Reports distinguish source excerpts from verified conclusions.

## Failure behaviour

If the search provider is not configured or fails and no local documents match, the report status is insufficient_evidence. The system does not generate placeholder market claims or fake source citations.

## Production requirements

Add durable encrypted storage, tenant access control, malware scanning, OCR, semantic retrieval, audit logs, source freshness checks, citation verification, observability and research evaluation datasets. Review third-party search-provider terms and data handling before production use.
