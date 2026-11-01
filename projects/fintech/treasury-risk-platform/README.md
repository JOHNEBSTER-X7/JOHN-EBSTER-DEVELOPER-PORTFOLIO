# Northstar Institutional Treasury & Risk Management Platform

A portfolio prototype for multi-currency treasury operations, liquidity forecasting, FX exposure analysis, counterparty limits, stress testing and approval-controlled treasury transactions.

## Technology
TypeScript, Node.js, Express, Zod, Vitest and Supertest.

## Capabilities
- Multi-currency balances for GBP, USD, EUR and JPY.
- GBP reporting valuation using explicitly illustrative FX rates.
- Dated inflow/outflow forecast and projected closing positions.
- FX exposure concentration and scenario stress tests.
- Counterparty exposure, limits, headroom and utilisation.
- Maker-checker approval workflow for treasury transactions.
- Outflow balance reservation, rejection release and approved completion.
- Executive dashboard API.

## Run locally
Requires Node.js 22+.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

Default port: 3460.

## API
- GET /health
- GET /dashboard
- GET /positions
- GET /forecast
- POST /forecast/flows
- GET /fx/exposure
- POST /risk/stress-test
- GET /counterparties
- GET /transactions
- POST /transactions
- POST /transactions/:id/decision
- POST /transactions/:id/complete

Amounts are integer minor units (pence/cents/yen minor unit convention as configured); API consumers must not send decimal major-unit values.

## Limitations and safety
This is a single-process demonstration using seeded synthetic balances, sample forecast flows, illustrative static FX rates and example counterparties. It is not connected to banks, payment rails, trading venues or live market data. It has no authentication, role-based permissions, durable database, transaction isolation, FX execution, hedge accounting, regulatory reporting or production-grade audit retention. Reviewer separation is demonstrated by comparing reviewer ID with account ID, not by secure identity verification. Forecasts and stress tests are illustrative, not financial advice or validated risk models. Never use it to manage real treasury funds.
