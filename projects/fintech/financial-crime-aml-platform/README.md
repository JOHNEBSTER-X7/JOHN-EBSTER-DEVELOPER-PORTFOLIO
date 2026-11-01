# Northstar Institutional Fraud Detection, AML & Financial Crime Compliance Platform

A portfolio prototype demonstrating KYC/KYB onboarding, synthetic sanctions/PEP name screening, transaction-monitoring rules, explainable risk scoring, investigation case management, suspicious-activity report drafting and audit events.

## Technology
TypeScript, Node.js, Express, Zod, Vitest and Supertest.

## Capabilities
- Individual and business customer onboarding with risk bands.
- Independent KYC review and enhanced-due-diligence gate for high-risk profiles.
- Synthetic watchlist screening for illustrative sanctions and PEP matches.
- Independent review and disposition of potential screening matches.
- Transaction monitoring using configurable demonstration rules.
- Alert severity, case creation, analyst assignment and investigation notes.
- Case closure with documented disposition.
- Draft suspicious-activity report workflow and independent review.
- Operational dashboard and structured audit events.

## Run locally
Requires Node.js 22+.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

Default port: 3490.

## API
- GET /health
- GET /dashboard
- GET /customers
- POST /customers
- POST /customers/:id/verification
- POST /customers/:id/screening
- POST /screening/:id/review
- POST /transactions/monitor
- GET /transactions
- GET /alerts
- POST /alerts/:id/cases
- GET /cases
- POST /cases/:id/assign
- POST /cases/:id/notes
- POST /cases/:id/close
- POST /cases/:id/report-drafts
- GET /reports
- POST /reports/:id/review
- GET /audit

Amounts are integer minor units.

## Limitations and safety
All customers, watchlist entries, transactions, alerts and cases are synthetic. Watchlist screening uses a tiny hard-coded demonstration list and exact/sub-string matching; it is not sanctions or PEP screening. The risk scoring and transaction rules are illustrative heuristics, not validated models. No identity verification, beneficial-ownership checks, adverse-media screening, ongoing real-time monitoring, regulator integration, SAR filing, legal reporting determination, secure identity/role enforcement, persistent database, immutable audit or production security controls are implemented. Report objects are drafts only and are never submitted to an authority. This prototype is not a substitute for regulated compliance controls or professional legal advice.
