# Northstar Institutional Private Equity, Venture Capital & Fund Administration Platform

A portfolio prototype demonstrating GP/LP onboarding, fund and SPV setup, investor subscriptions, capital commitments, capital calls, portfolio valuation, NAV, distribution allocation, carried-interest calculations and investor statements.

## Technology
TypeScript, Node.js, Express, Zod, Vitest and Supertest.

## Capabilities
- GP and LP records with independent verification.
- Fund and SPV setup with currency, target, management fee, carry and hurdle terms.
- Investor subscriptions with acceptance/rejection workflow and fund target checks.
- Fund activation after accepted commitments.
- Capital calls allocated pro rata to accepted LP commitments.
- Partial and full call-payment recording.
- Portfolio investment register and valuation updates.
- Fund NAV and unrealised gain calculation.
- Distribution allocation and simplified carry above a hurdle calculation.
- Investor statements, audit events and operational dashboard.

## Run locally
Requires Node.js 22+.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

Default port: 3492.

## API
- GET /health, GET /dashboard
- POST /people, POST /people/:id/verify
- GET/POST /funds, POST /funds/:id/activate
- GET/POST /subscriptions, POST /subscriptions/:id/review
- GET/POST /capital-calls, POST /capital-calls/:id/payments
- GET/POST /investments, PATCH /investments/:id/valuation
- GET /funds/:id/nav
- POST/GET /distributions
- GET /funds/:id/investors/:investorId/statement
- GET /audit

All monetary values use integer minor units.

## Important limitations
This is an educational in-memory simulation, not fund administration software for real assets or investors. It does not perform legal fund formation, investor KYC/AML, suitability, tax, regulatory reporting, banking, custody or payment processing. Commitments and payments are records only; no cash is received. NAV is a simplified sum of investment fair values and excludes liabilities, accrued fees, expenses, FX translation, equalisation, side pockets and other accounting adjustments. Distribution and carry are simplified illustrative calculations, not a complete European or American waterfall; no preferred return compounding, catch-up, clawback, escrow, tax or legal agreement logic. Management fee terms are stored but not accrued. Data is not persisted and there is no authentication, RBAC, segregation of duties or production security. Do not use for actual fund operations, investor reporting or financial decisions.
