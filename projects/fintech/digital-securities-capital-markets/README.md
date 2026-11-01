# Northstar Institutional Digital Securities & Capital Markets Platform

A portfolio prototype for securities issuance, investor eligibility, primary allocations, order matching, settlement simulation, custody registers, corporate actions and audit history.

## Technology
TypeScript, Node.js, Express, Zod, Vitest and Supertest.

## Capabilities
- Issuer onboarding and independent verification.
- Individual and institutional investor onboarding and eligibility review.
- Equity and bond instrument registration with ISIN-format validation.
- Primary-market allocations constrained by total authorised issue units.
- Limit buy/sell order entry and price/time matching simulation.
- Settlement workflow updating investor custody positions.
- Cash distribution announcements and allocation to registered holdings.
- Corporate action register and operational dashboard.
- Structured audit events.

## Run locally
Requires Node.js 22+.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

Default port: 3491.

## API
- GET /health, GET /dashboard
- GET/POST /investors, POST /investors/:id/review
- GET/POST /issuers, POST /issuers/:id/verify
- GET/POST /securities
- POST /allocations, GET /holdings
- POST/GET /orders, GET /trades, POST /trades/:id/settle
- GET/POST /corporate-actions, POST /corporate-actions/:id/process
- GET /distributions, GET /audit

All prices and monetary amounts are integer minor units.

## Important limitations
This is an educational simulation. It is not a trading venue, exchange, CSD, custodian, broker, transfer agent, investment service or regulated securities platform. Investors, issuers, securities and orders are synthetic. ISIN validation checks only the expected character pattern, not official allocation or registration. The matching engine is simplified and does not implement market surveillance, auction logic, price collars, venue rules, best execution, short-sale controls or full order priority guarantees. Settlement is an in-memory transfer of simulated units; there is no cash leg, delivery-versus-payment, external custody, blockchain finality or settlement guarantee. Cash distributions are recorded, not paid. Stock-split announcement is supported but processing is deliberately not implemented. No authentication, permissions, persistent database, regulatory reporting or production security controls are included. Do not use with real securities, investor funds or personal data.
