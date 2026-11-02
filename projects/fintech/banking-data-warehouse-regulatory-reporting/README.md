# Northstar Institutional Banking Data Warehouse & Regulatory Reporting

A TypeScript demonstration of a consolidated banking reporting layer. It normalises synthetic operational records and exposes executive, payments, treasury, fraud/AML, reconciliation, data-quality, lineage and audit reporting.

## Run locally

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

The API listens on port 3810 by default. The server loads illustrative records into an in-memory demo warehouse.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /health | Health check |
| POST | /api/ingest | Validate and ingest one canonical record |
| GET | /api/reports/executive | Cross-domain KPIs |
| GET | /api/reports/payments | Payment volumes by status |
| GET | /api/reports/treasury | Treasury totals by currency |
| GET | /api/reports/risk | Fraud, AML and operational counts |
| GET | /api/reports/reconciliation | Break count and amounts |
| GET | /api/data-quality | Quality exceptions |
| GET | /api/lineage | Source-level record counts and freshness |
| GET | /api/audit | Recent ingestion audit events |
| GET | /api/export?format=csv|json | Reporting export |

Ingestion uses a caller-supplied unique `batchId` for idempotency. Records use integer minor currency units (for example, pence or cents). `x-actor` is an illustrative audit attribution header, not authentication.

## Reporting and governance

See [ARCHITECTURE.md](docs/ARCHITECTURE.md), [DATA_DICTIONARY.md](docs/DATA_DICTIONARY.md), [REPORTING_CATALOGUE.md](docs/REPORTING_CATALOGUE.md), [GOVERNANCE_AND_LIMITATIONS.md](docs/GOVERNANCE_AND_LIMITATIONS.md), and [INTERVIEW_GUIDE.md](docs/INTERVIEW_GUIDE.md).

## Scope and limitations

This is an educational prototype with synthetic fixtures and in-memory storage. It is not connected to the separate Northstar event-streaming or payments projects. It does not implement a production warehouse, SQL/columnar storage, CDC, orchestration, distributed ingestion, access control, encryption, retention controls, regulatory filing schemas or regulatory approval. Report definitions are illustrative management information, not official regulatory returns or compliance advice. Monetary values are aggregated by currency and are never combined across currencies.
