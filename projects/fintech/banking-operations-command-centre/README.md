# Northstar Institutional Banking Operations Command Centre

A responsive operations dashboard and REST API that brings together synthetic banking payments, treasury liquidity, fraud/AML monitoring alerts, reconciliation exceptions and operational work queues.

> **Portfolio simulation only.** All records are synthetic. The command centre is a standalone demonstration with seeded data; it does not connect to or aggregate the previously built portfolio applications, live banks, payment networks, sanctions providers or production ledgers.

## What it demonstrates

- Executive KPIs across payment processing, alerts, work queues and treasury buffers.
- Payment lifecycle overview and recent payment instructions.
- GBP, USD and EUR liquidity accounts with reserved and available balances.
- Buffer-threshold indicators for liquidity monitoring.
- Cross-domain alert prioritisation: fraud, AML, payments, reconciliation and treasury.
- Human-operated alert actions: acknowledge, investigate, escalate and resolve.
- Operational task ownership and status workflow.
- Recent operational activity and audit events.
- Responsive browser dashboard with 30-second refresh.
- REST API with Zod validation and automated tests.

## Architecture

The UI is served by Express and consumes the same API that exposes dashboard metrics and workflow actions. The service currently uses seeded in-memory collections. Each domain is represented as an operational view, not as a connected subsystem. See [architecture](./docs/ARCHITECTURE.md) and [integration roadmap](./docs/INTEGRATION_ROADMAP.md).

## Run locally

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Open http://localhost:3600. Override the port with `PORT`.

## API endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Service and demo mode |
| GET | `/api/dashboard` | Consolidated KPIs and payment/liquidity metrics |
| GET | `/api/payments` | Recent synthetic payment instructions |
| GET | `/api/alerts`, `/api/alerts/:id` | Monitoring alerts |
| POST | `/api/alerts/:id/actions` | Acknowledge, investigate, escalate or resolve |
| GET | `/api/work-items` | Operational work queue |
| POST | `/api/work-items/:id/status` | Change work-item status |
| GET | `/api/liquidity` | Available and reserved liquidity |
| GET | `/api/activity` | Recent cross-domain activity |
| GET | `/api/audit` | Operator actions |

## Dashboard operations

1. Review headline KPIs and payment status distribution.
2. Inspect the payment instruction table.
3. Review alerts and record an operational action.
4. Monitor available balances against synthetic buffer thresholds.
5. Start or complete work queue items.
6. Refresh manually or allow the 30-second refresh interval.

## Security and operational limitations

This is not a production banking control plane. There is no authentication, authorisation/RBAC, multi-tenancy, persistent database, integration adapter, message broker, event streaming, double-entry ledger, secure secrets management, tamper-evident audit storage, approval policy engine, live transaction feed, bank connectivity, real AML/fraud provider, payment network integration, live FX conversion, production reconciliation or operational resilience controls. Actor labels are not authenticated. Dashboard figures are illustrative and must not be used for financial or compliance decisions.

A production implementation would require domain APIs with authenticated service-to-service access, data contracts, event-driven integration, durable storage, strong identity and permissions, segregation of duties, monitoring, privacy controls, reconciliation guarantees, disaster recovery and independent security/compliance assurance.

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Integration roadmap](./docs/INTEGRATION_ROADMAP.md)
- [Operations and control model](./docs/OPERATIONS_AND_CONTROLS.md)
- [Interview guide](./docs/INTERVIEW_GUIDE.md)
