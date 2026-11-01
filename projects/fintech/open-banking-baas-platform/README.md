# Northstar Institutional Banking-as-a-Service & Open Banking Platform

A portfolio prototype demonstrating consent-based account aggregation, transaction access, payment initiation, transaction categorisation, fraud-alert triage, statement-reference reconciliation and audit events.

## Technology
TypeScript, Node.js, Express, Zod, Vitest and Supertest.

## Capabilities
- Multi-provider simulated account register with GBP, USD and EUR accounts.
- Customer-scoped consent grants, requested scopes, expiry and revocation.
- Consent-bound account and transaction aggregation.
- Client-bound consent checks and account scope enforcement.
- Payment initiation with idempotency keys and available-balance reservation.
- Payment completion/rejection lifecycle.
- Rule-based transaction categorisation.
- Illustrative suspicious-activity alerts and review workflow.
- Statement-reference reconciliation.
- Structured audit events and operational dashboard.

## Run locally
Requires Node.js 22+.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

Default port: 3480.

## API
- GET /health
- GET /dashboard
- GET /accounts?userId=...
- POST /consents
- GET /consents/:id
- POST /consents/:id/revoke
- GET /aggregated/accounts (x-consent-id and x-client-id headers)
- GET /aggregated/accounts/:accountId/transactions (same headers)
- POST /payments
- GET /payments (x-client-id header)
- POST /payments/:id/complete
- POST /payments/:id/reject
- POST /transactions/:id/category
- GET /fraud/alerts
- POST /fraud/alerts/:id/review
- POST /reconciliation
- GET /audit

## Limitations and safety
All institutions, accounts, customers, transactions, consents, payments and alerts are synthetic. This is not connected to Open Banking production APIs, banks, payment schemes or the UK Open Banking Directory. Header values are demonstration identifiers, not authentication. It does not implement OAuth 2.0, FAPI, mTLS, signed requests, secure token storage, real Strong Customer Authentication, regulatory permissions, persistent storage, transaction isolation, payment scheme settlement, AML screening or a validated fraud model. The fraud rules are illustrative and not a basis for blocking real customers or reporting suspicious activity. Never use it to access real bank accounts or move real funds.
