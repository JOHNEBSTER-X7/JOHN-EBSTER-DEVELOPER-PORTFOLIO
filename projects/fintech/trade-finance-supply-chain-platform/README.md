# Northstar Institutional Trade Finance & Supply Chain Finance Platform

A portfolio prototype demonstrating trade-party onboarding, document verification, letters of credit and supply-chain finance application workflows, transparent risk scoring, lender limits, independent approvals, simulated funding and settlement, and audit events.

## Technology
TypeScript, Node.js, Express, Zod, Vitest and Supertest.

## Capabilities
- Importer, exporter, lender and logistics-provider onboarding.
- Independent party verification workflow.
- Letter of credit, invoice finance and purchase-order finance application types.
- Required trade-document register with independent verification.
- Explainable rule-based risk score and risk bands.
- Lender currency and facility-limit checks.
- Maker-checker credit decisions and separate funding operator.
- Simulated funding and settlement lifecycle.
- Application audit-event history and executive dashboard.

## Run locally
Requires Node.js 22+.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

Default port: 3470.

## API
- GET /health
- GET /dashboard
- GET /parties
- POST /parties
- POST /parties/:id/verification
- GET /lenders
- GET /applications
- POST /applications
- GET /applications/:id
- POST /applications/:id/documents
- POST /applications/:id/documents/:documentId/verification
- POST /applications/:id/submit
- POST /applications/:id/decision
- POST /applications/:id/fund
- POST /applications/:id/settle
- GET /audit?entityId=...

All amounts use integer minor units, not floating-point major currency values.

## Limitations and safety
This is a single-process educational prototype. Party verification, credit review, funding and settlement are simulated. There are no external KYC/AML checks, document authenticity checks, bank/payment integrations, real letters of credit, lender contracts, persistent database, authenticated user identities, secure role-based access control, sanctions screening, legal review or regulated financial services. The risk score is a transparent illustrative heuristic, not a credit model. The audit log is in-memory and not tamper-evident. Do not use it to arrange, approve or disburse real trade finance.
