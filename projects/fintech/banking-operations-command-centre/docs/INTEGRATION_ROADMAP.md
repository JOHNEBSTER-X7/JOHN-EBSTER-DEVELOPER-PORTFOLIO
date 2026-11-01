# Integration roadmap

## Phase 1 — Prototype (implemented)

- Consolidated synthetic payments, liquidity, monitoring alerts, reconciliation and work queues.
- Dashboard KPI aggregation and responsive UI.
- Alert and work-item workflow actions.
- API tests, TypeScript checks and build workflow.

## Phase 2 — Secure domain adapters

- Define versioned API contracts for payments, treasury, fraud, AML, reconciliation and case management.
- Add authenticated service identities and scoped authorisation.
- Connect to each domain's approved read APIs; do not query their private databases.
- Include source-system identifiers, timestamps, data freshness and correlation IDs.
- Implement timeout, retry, circuit-breaker and degraded-mode behaviour.

## Phase 3 — Event-driven operations

- Consume versioned events through a durable message broker.
- Use idempotent consumers, replay protection, dead-letter queues and schema registry.
- Store operational projections separately from source-of-record ledgers.
- Reconcile event counts and balances against authoritative domain systems.

## Phase 4 — Institutional controls

- SSO, MFA, RBAC, maker-checker and segregation of duties.
- Tamper-evident audit trail and privileged-access monitoring.
- Case evidence retention, privacy controls and data minimisation.
- Resilience testing, disaster recovery, operational SLAs and security review.

## Phase 5 — Analytics and management reporting

- Historical trend analysis and alert ageing.
- Settlement throughput, failure and return metrics.
- Intraday liquidity and currency exposure.
- Reconciliation breaks and ageing.
- Analyst workload, case outcomes and false-positive feedback loops.

No phase beyond the prototype is represented as implemented in this repository.
