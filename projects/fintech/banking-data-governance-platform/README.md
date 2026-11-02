# Northstar Banking Data Governance, Metadata & Data Quality

A TypeScript API prototype for registering banking datasets, assigning owners and stewards, versioning schemas, defining quality rules, validating records, tracking lineage and managing governance issues.

## Run
```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```
Default port: 3820.

## Main API
- `GET /api/catalogue`, `GET /api/summary`
- `POST /api/datasets`, `GET /api/datasets`
- `POST /api/datasets/:id/schemas`, `POST /api/schemas/:id/approve`
- `POST /api/rules`, `POST /api/datasets/:id/validate`
- `GET /api/findings`, `POST /api/issues`, `PATCH /api/issues/:id`
- `POST /api/lineage`, `GET /api/lineage`, `GET /api/audit`

See docs for architecture, governance concepts and limitations.

## Limitations
In-memory educational prototype; no durable database, authentication, authorisation, encryption, workflow engine, automated discovery, data masking, retention/deletion enforcement or integration with the separate banking portfolio projects. Classification and schema approval are metadata demonstrations, not security controls or regulatory certification.
