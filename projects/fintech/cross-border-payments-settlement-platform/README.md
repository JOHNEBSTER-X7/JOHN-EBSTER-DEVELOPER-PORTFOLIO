# Northstar Institutional Payments, Cross-Border Settlement & Treasury Infrastructure

A TypeScript/Node.js portfolio prototype modelling institutional payment orchestration, multi-currency treasury, correspondent routing, FX quotes, screening gates, settlement lifecycle and statement reconciliation.

> **Simulation only.** This project does not connect to SWIFT, a bank, a payment scheme, a sanctions provider, a live FX market or a settlement network. ISO 20022 and SWIFT-style outputs are illustrative message representations, not certified or transmittable production messages. Never use real customer data or funds.

## Capabilities

- GBP, USD and EUR synthetic accounts with integer minor-unit balances and reserved liquidity.
- Beneficiary directory and deterministic domestic/cross-border routing.
- Explicit FX quotes, acceptance and expiry checks; conversion uses scaled integer rates and BigInt arithmetic.
- Idempotent payment initiation and payload-mismatch protection.
- Payment lifecycle: screening pending → approved/held → queued → in transit → settled; controlled rejection, cancellation and return paths.
- Independent approval gate, balance reservation, dispatch and settlement.
- Synthetic destination-country/name screening rules with reason capture.
- ISO 20022 pacs.008-style XML and SWIFT MT103-style text generation for demonstration.
- Statement-line reconciliation with matched, unmatched and missing records.
- Treasury dashboard, available/reserved liquidity and immutable-in-process audit event history.

## Technology

TypeScript, Node.js 22, Express, Zod, Vitest and Supertest.

## Run locally

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

The API listens on port 3000 by default. Set `PORT` to change it.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health and simulation mode |
| GET | `/dashboard` | Treasury and payment metrics |
| GET | `/accounts`, `/beneficiaries`, `/payments` | Demo records |
| GET | `/liquidity`, `/fx/quotes`, `/audit` | Treasury and control data |
| POST | `/fx/quotes` | Create a synthetic FX quote |
| POST | `/fx/quotes/:id/accept` | Accept a valid quote |
| POST | `/payments` | Initiate an idempotent payment |
| POST | `/payments/:id/screen` | Run demo screening rules |
| POST | `/payments/:id/approve` | Reserve liquidity and queue payment |
| POST | `/payments/:id/dispatch` | Move payment in transit |
| POST | `/payments/:id/settle` | Simulate settlement |
| POST | `/payments/:id/return` | Simulate a return |
| POST | `/payments/:id/reject`, `/cancel` | Controlled terminal paths |
| GET | `/messages/:paymentId` | Generate illustrative payment message |
| POST | `/reconciliation/import` | Import synthetic statement lines |
| GET | `/reconciliation` | Read reconciliation results |

### Example: create a domestic GBP payment

```bash
curl -X POST http://localhost:3000/payments \
  -H 'content-type: application/json' \
  -d '{"idempotencyKey":"demo-1001","sourceAccountId":"acc-gbp-001","beneficiaryId":"ben-001","amountMinor":12500,"currency":"GBP","rail":"iso20022_simulation"}'
```

Screen the returned payment ID, approve it with a named independent checker, dispatch it and settle it:

```bash
curl -X POST http://localhost:3000/payments/PAYMENT_ID/screen
curl -X POST http://localhost:3000/payments/PAYMENT_ID/approve \
  -H 'content-type: application/json' -d '{"actor":"independent-checker"}'
curl -X POST http://localhost:3000/payments/PAYMENT_ID/dispatch
curl -X POST http://localhost:3000/payments/PAYMENT_ID/settle
```

Amounts are integer minor units (for the seeded two-decimal currencies, 12500 = GBP 125.00). FX rates are accepted as decimal input and stored as an integer scaled by 100,000,000. This demonstration currently supports GBP, USD and EUR only.

## Design notes

- Funds are reserved at approval, debited at settlement and released or restored on supported return paths.
- A repeated idempotency key with the same core payment payload returns the original payment. Reusing it with a different payload is rejected.
- Screening rules are intentionally synthetic and must not be interpreted as sanctions, PEP or adverse-media screening.
- Routing and correspondent bank identifiers are seeded examples, not real connectivity.
- Audit events are process-local and are not tamper-proof storage.

## Known limitations and production gaps

In-memory state resets when the process restarts. There is no authentication, authorisation/RBAC, tenant isolation, database, durable outbox, distributed idempotency store, cryptographic signing, HSM, double-entry general ledger, real-time sanctions/PEP provider, case-management integration, bank connectivity, SWIFT Alliance access, scheme certification, live FX feed, settlement finality guarantee, production-grade holiday/calendar logic, retry queue, observability stack, disaster recovery or independent security review. The sample approval identity is a workflow demonstration, not a secure maker-checker control. The currency exponent is currently fixed to two decimals in message formatting. External payment and FX execution are not performed.

Before production use, design and independently validate regulatory permissions, safeguarding, AML controls, sanctions screening, operational resilience, security, data protection, scheme/network access, ledger integrity and reconciliation controls with qualified specialists.

## Project documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Control matrix](./docs/CONTROL_MATRIX.md)
- [ISO 20022 and SWIFT-style message examples](./docs/ISO20022_MESSAGE_EXAMPLE.md)
- [Interview guide](./docs/INTERVIEW_GUIDE.md)
