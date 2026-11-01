# Northstar Institutional Digital Asset Exchange

A portfolio prototype demonstrating a central limit order book, price-time-priority matching, market and limit orders, cancellations, trade records, simulated balances, market depth and REST APIs.

## Technology
TypeScript, Node.js, Express, Zod, Vitest and Supertest.

## Features
- Limit orders cross at the resting maker price.
- Price-time priority: best price first, then earliest order.
- Partial fills and remaining open quantity.
- Market orders execute against available resting limit liquidity.
- Simulated base/quote balances and pre-trade balance checks.
- Order cancellation with owner check.
- Market depth aggregation and trade history.
- Configurable tick size, lot size and maximum order notional in market configuration.
- API validation and error responses.

## Run locally
Requires Node.js 22+.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

Default API port: 3450.

## API
- GET /health
- GET /markets
- POST /accounts/:accountId/fund (demo funding only)
- GET /accounts/:accountId/balance
- POST /orders
- DELETE /orders/:id with JSON body {"accountId":"..."}
- GET /orders?accountId=...
- GET /order-book/:symbol
- GET /trades?symbol=...

## Limitations and safety
This is an in-memory matching-engine demonstration, not a live exchange. Balances are simulated and funding is an unrestricted demo faucet. There is no custody, real deposits/withdrawals, authentication, account segregation, durable storage, market surveillance, regulatory controls, settlement integration, fee collection or operational resilience. The prototype does not reserve funds for resting orders; balance checks at order entry do not prevent a user from placing multiple simultaneous orders that collectively exceed their wallet balance. Production requires atomic balance reservation, transactional persistence, concurrency-safe matching, full precision decimal arithmetic, robust replay/recovery, surveillance, independent security review and jurisdiction-specific regulatory assessment. Never connect real customer funds or present this prototype as a regulated exchange.
