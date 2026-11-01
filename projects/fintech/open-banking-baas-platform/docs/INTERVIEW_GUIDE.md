# Interview guide

## How does consent-based aggregation work?
The client must present a consent identifier and matching client identifier. The consent must be active, include the requested scope and include the requested account.

## How are payments made idempotent?
A client-scoped idempotency key maps retries to the original payment record, avoiding duplicate simulated payment creation.

## How are available balances protected?
An accepted payment reserves available funds. Completion reduces the simulated ledger balance; rejection releases the reservation.

## What is the main security limitation?
The client and consent headers are demonstration identifiers, not credentials. Production requires OAuth 2.0, FAPI-grade controls, strong customer authentication, TLS/mTLS, durable storage, robust authorisation and bank certification.

## What would you improve next?
Add secure token lifecycle, real bank sandbox adapters, PostgreSQL transactions, event-driven payment processing, richer reconciliation, fraud model governance and operational dashboards.
