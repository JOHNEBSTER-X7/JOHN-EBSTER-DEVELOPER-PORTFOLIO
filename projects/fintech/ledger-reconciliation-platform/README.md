# Northstar FinTech Ledger & Reconciliation Platform

A portfolio-grade financial operations API demonstrating double-entry bookkeeping, journal validation, idempotent posting, account balances and bank statement reference reconciliation.

## Features

- Chart of accounts with asset, liability, revenue, expense and equity classifications.
- Double-entry journal posting with integer minor units (pence), balanced debit/credit validation and currency consistency.
- Idempotency keys to make repeated posting requests return the original journal.
- Immutable posted journal records in the application process.
- Account balances calculated from journal lines.
- Statement reference reconciliation with matched, unmatched and missing ledger references.
- API metrics, validation errors and health endpoint.
- TypeScript, Express, Zod, Vitest and Supertest.

## Run locally

Requires Node.js 22+.

    npm install
    npm run dev

The API listens on port 3410 by default.

## Test and build

    npm run typecheck
    npm test
    npm run build

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/metrics | Ledger metrics |
| GET/POST | /api/accounts | List or create accounts |
| GET | /api/journals | List journal entries |
| GET | /api/journals/:id | Retrieve a journal |
| POST | /api/journals | Post a balanced journal |
| POST | /api/reconciliation | Reconcile statement references |

### Example journal request

    {
      "reference": "PAY-1002",
      "description": "Customer wallet funding",
      "currency": "GBP",
      "idempotencyKey": "payment-1002-key",
      "lines": [
        { "accountId": "cash-clearing", "debitCents": 2500, "creditCents": 0 },
        { "accountId": "wallet-customer", "debitCents": 0, "creditCents": 2500 }
      ]
    }

All amounts are integer minor units; 2500 represents £25.00. Never use floating-point amounts for ledger calculations.

## Important limitations

This is an educational portfolio prototype, not a bank, payment processor or regulated financial product. It does not move or custody real money. Data is in memory and resets on restart. Reconciliation currently matches external references and does not compare statement amounts against journal totals. There is no authentication, authorisation, multi-tenant isolation, persistent database, settlement integration, fraud monitoring, sanctions screening or production-grade audit retention. Do not use real customer or financial data.

Before production, add durable transactional storage with database constraints, atomic posting, access controls, maker-checker approval, tamper-evident audit logs, full amount/currency reconciliation, operational monitoring, security testing and independent financial controls review.
