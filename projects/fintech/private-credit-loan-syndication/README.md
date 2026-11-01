# Northstar Institutional Private Credit, Lending & Loan Syndication Platform

A portfolio prototype demonstrating borrower and lender onboarding, credit applications, underwriting decisions, syndicated facilities, drawdowns, repayment schedules, payment allocation, collateral records and covenant monitoring.

## Technology
TypeScript, Node.js, Express, Zod, Vitest and Supertest.

## Capabilities
- Borrower and lender records with independent verification.
- Corporate credit applications and reviewer-controlled approval or rejection.
- Facility creation from approved applications.
- Lender participation allocation and full-syndication activation gate.
- Drawdowns constrained by committed facility capacity.
- Monthly equal-principal amortisation schedule with interest approximation.
- Payment application to interest then principal.
- Collateral register.
- Leverage and interest-coverage covenant monitoring.
- Portfolio dashboard and audit events.

## Run locally
Requires Node.js 22+.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

Default port: 3493.

## API
- GET /health, GET /dashboard
- GET/POST /parties, POST /parties/:id/verify
- GET/POST /applications, POST /applications/:id/review
- GET/POST /facilities
- POST /facilities/:id/participations, GET /participations
- GET /loans, POST /facilities/:id/drawdowns
- GET /loans/:id/schedule, POST /loans/:id/payments, GET /payments
- GET/POST /collateral
- GET/POST /covenants, POST /covenants/:id/test
- GET /audit

All monetary values use integer minor units.

## Important limitations
This is an educational in-memory simulation, not a bank, lender, broker, credit bureau or regulated lending platform. No real credit bureau, identity, AML, bank, payment, collateral registry or legal integrations are present. Underwriting is a human reviewer status gate and does not assess real borrower creditworthiness. Syndication allocations are records only; lender funds are not collected. Drawdowns and repayments are simulated. The amortisation schedule uses equal principal instalments and monthly simple-interest approximations, not a contractual day-count convention. Payment allocation is limited to the generated schedule; late fees, arrears, prepayment, restructuring, default and recoveries are not implemented. Covenant observations are manually supplied and not linked to verified financial statements. No authentication, role-based access, persistent storage, double-entry accounting or production security controls are included. Do not use with real borrowers, lender funds or credit decisions.
