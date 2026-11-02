# Northstar Institutional Banking Regulatory Reporting & Compliance Intelligence

A TypeScript/Express demonstration of a bank-style regulatory reporting operating model: obligation inventory, entity and jurisdiction mapping, reporting schedules, report validation, maker-checker approvals, submission lifecycle, regulatory-change impact assessment and an audit trail.

## Run locally
```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```
API listens on port 3000 by default.

## API
- `GET /health`, `GET /api/dashboard`
- `GET|POST /api/obligations`
- `GET|POST /api/reports`
- `POST /api/reports/:id/validate`
- `POST /api/reports/:id/approve` with `{ "approver": "SecondLineReviewer" }`
- `POST /api/reports/:id/submit`
- `GET|POST /api/regulatory-changes`
- `PATCH /api/regulatory-changes/:id/assessment`
- `GET /api/audit-trail`

Pass an optional `x-actor` header to label actions in the audit trail. This is attribution for the demo, not authentication.

## Reporting workflow
1. Register an obligation with jurisdiction, legal entity, owner, frequency and due date.
2. Create a report for a reporting period; duplicate entity/obligation/period reports are rejected.
3. Validate required reporting fields and date format.
4. Route valid reports to review.
5. A different user approves the report (maker-checker).
6. Record a submission event and timestamp.
7. Track regulatory changes and capture an impact assessment and action status.

## Scope and safeguards
All seeded obligations are synthetic examples, not actual UK/EU regulatory requirements. No regulatory interpretation, filing format, regulator API, submission, or legal advice is provided. Submission is a local state transition only. The service uses in-memory storage; data resets on restart. It has no production authentication, authorization, database, encryption, immutable audit log, workflow scheduler, or regulatory source feed. Do not use it for live regulatory reporting or compliance decisions.
