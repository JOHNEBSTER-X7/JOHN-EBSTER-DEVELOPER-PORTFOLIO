# Northstar Enterprise Research & Intelligence

An evidence-led research workspace combining optional live web search with uploaded PDF, TXT and Markdown documents. It retrieves source material, extracts query-related themes, builds a source register and generates exportable Markdown reports.

## Features

- Research briefs for market, competitor and business questions.
- Optional live web search through the Tavily Search API.
- PDF, TXT and Markdown ingestion.
- Text extraction, chunking and local lexical retrieval.
- Source register with URLs, source type and retrieval relevance.
- Evidence gaps and limitations in every report.
- Markdown report export and browser dashboard.
- TypeScript, Express, Zod, Helmet, rate limiting and automated tests.

## Run locally

Requires Node.js 22 or later.

    cd projects/ai/enterprise-research-intelligence
    npm install
    cp .env.example .env
    npm run dev

Open http://localhost:3200.

Set TAVILY_API_KEY in .env to enable live web research. Without it, the application searches uploaded documents only. With no matching documents, it returns an insufficient-evidence report rather than inventing sources or findings.

## Commands

    npm run typecheck
    npm test
    npm run build
    npm start

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Health check |
| POST | /api/documents | Upload PDF, TXT or Markdown |
| GET | /api/documents | List indexed documents |
| POST | /api/research | Run a research question |
| GET | /api/reports | List research reports |
| GET | /api/reports/{id} | Retrieve report details |
| GET | /api/reports/{id}/export | Export report as Markdown |

## Evidence and scoring

The displayed relevance score is a search-provider score for web results or a lexical overlap score for uploaded passages. It is not a measure of publisher credibility, factual accuracy or completeness. Search snippets are pointers to sources, not substitutes for reviewing the original material.

The report organises retrieved passages and query themes. It does not independently verify claims, calculate market sizes or establish competitor financial performance. Verify important conclusions against primary documents, official statistics and current filings.

## Limitations and safeguards

- Uploaded files and reports are stored in process memory and are lost on restart.
- No OCR for scanned PDFs.
- No embeddings or semantic vector database; local retrieval uses token overlap.
- Live search requires a Tavily API key and may be unavailable due to provider errors or quota.
- No authentication, tenant isolation, durable database, audit log, antivirus scanning or production document security.
- Do not upload confidential, regulated or personal documents.
- This is a portfolio prototype, not a substitute for professional market, legal, investment or due-diligence research.

See docs/ARCHITECTURE.md and docs/INTERVIEW_GUIDE.md.

## Licence

MIT. See the repository-level licence.
