# Northstar Institutional Fraud Detection, Transaction Monitoring & Payment Intelligence

An explainable TypeScript portfolio prototype for transaction-risk monitoring, fraud signal detection, alert generation, shared-counterparty analysis and investigator case management.

> **Synthetic demonstration only.** All transactions and identities are fictional. Scores are rule-based indicators, not predictions of criminality or proof of fraud. This system is not a regulated AML/sanctions screening service, credit decision engine or production fraud control.

## Capabilities

- Transaction ingestion with reference-level idempotency.
- Explainable 0–100 risk scoring with individual signal codes and reasons.
- Rules for large-value activity, high-risk destination indicators, geographic inconsistency, device changes, transaction velocity, debit bursts, round-value transfers and shared-counterparty networks.
- Risk bands: low, medium, high and critical.
- Automatic alert/case creation for medium-and-above risk indicators.
- Analyst assignment, case notes, escalation and controlled disposition.
- Shared-counterparty network view to identify synthetic customer-to-counterparty links.
- Management dashboard with risk distribution, case status, alert rate and top signal codes.
- Audit events for scoring and case-management actions.
- REST API with Zod validation and automated tests.

## Stack

TypeScript, Node.js 22, Express, Zod, Vitest and Supertest.

## Run locally

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Default API port: 3500. Override with `PORT`.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health and synthetic-data mode |
| POST | `/transactions` | Ingest and score a transaction |
| GET | `/transactions` | List transactions and scores |
| GET | `/transactions/:id` | Transaction detail and signal explanations |
| GET | `/alerts` | Transactions with risk score 35+ |
| GET | `/cases`, `/cases/:id` | Alert investigation cases |
| POST | `/cases/:id/assign` | Assign an analyst |
| POST | `/cases/:id/notes` | Add an investigation note |
| POST | `/cases/:id/escalate` | Escalate a case |
| POST | `/cases/:id/close` | Close with a disposition and rationale |
| GET | `/network/shared-counterparties` | Shared synthetic counterparty graph data |
| GET | `/dashboard` | Monitoring and operational metrics |
| GET | `/audit` | Audit events |

### Example transaction

```bash
curl -X POST http://localhost:3500/transactions \
  -H 'content-type: application/json' \
  -d '{"reference":"demo-001","customerId":"customer-1","accountId":"account-1","amountMinor":700000,"currency":"GBP","direction":"debit","counterpartyId":"merchant-1","counterpartyName":"Demo Merchant","country":"GB","channel":"web","occurredAt":"2026-10-01T10:00:00.000Z"}'
```

The example amount is expressed in minor units (700000 = GBP 7,000.00 for the demo currency precision). The engine is deterministic against transaction history supplied to it; it does not train a machine-learning model.

## Scoring interpretation

Signals add weighted points and the total is capped at 100. Bands are low (0–34), medium (35–59), high (60–79) and critical (80–100). A score of 35 or more opens an investigation case. The thresholds and weights are illustrative and require calibration against representative, labelled data before operational use.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Rules and model governance](./docs/RULES_AND_MODEL_GOVERNANCE.md)
- [Investigator playbook](./docs/INVESTIGATOR_PLAYBOOK.md)
- [Interview guide](./docs/INTERVIEW_GUIDE.md)

## Limitations and production requirements

State is held in memory and resets on restart. There is no authentication, role-based access control, tenant isolation, database, durable event pipeline, streaming ingestion, distributed idempotency, customer profile enrichment, trusted device intelligence, graph database, model training, feature store, explainability validation, threshold governance, case SLA engine, secure evidence storage, regulatory reporting, real sanctions/PEP/adverse-media provider, payment blocking integration, real-time bank connectivity, production observability or independent security review. Currency thresholds are simplified and do not normalize FX values. This demo does not assess a real customer's behaviour or make decisions about access to financial services.

Production deployment would require legal and compliance review, privacy impact assessment, data minimisation, robust model governance, bias and false-positive testing, human oversight, secure audit retention, operational resilience and integration testing with authorised providers.
