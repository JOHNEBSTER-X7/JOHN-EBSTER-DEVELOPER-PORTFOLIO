# Northstar Institutional Banking Regulatory Data Validation, Reconciliation & Submission Controls

A TypeScript/Express demonstration of regulatory data quality operations: dataset ingestion, configurable validation rules, issue management, cross-source reconciliation, materiality tolerances, submission-readiness gates and audit events.

## Run
```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

## API
- `GET /health`, `GET /api/dashboard`
- `GET|POST /api/datasets`
- `GET|POST /api/rules`
- `POST /api/datasets/:id/validate`
- `GET /api/issues`, `PATCH /api/issues/:id`
- `GET|POST /api/reconciliations`
- `GET|POST /api/submission-gates`
- `POST /api/submission-gates/:id/evaluate`
- `POST /api/submission-gates/:id/approve`
- `GET /api/audit-trail`

Set `x-actor` to label audit events; this is demo attribution, not authentication.

## Capabilities
- Configurable required-field, non-negative numeric, unique-key and currency checks.
- Severity-ranked exceptions with owner, status and mandatory resolution/waiver rationale.
- Period-aligned reconciliation by business key and numeric field, with configurable tolerance.
- Readiness gates require clean validation and at least one fully matched reconciliation per required dataset.
- Approval is recorded only after gate checks pass.

## Limitations
In-memory only; data resets on restart. Sample datasets are user-supplied/synthetic. No actual regulatory schemas, official reporting calculations, source-system connectors, automated remediation, regulator submission, authentication, role enforcement, immutable audit storage or certification. A readiness approval is a local control record, not regulatory approval. Not for live regulatory reporting.
