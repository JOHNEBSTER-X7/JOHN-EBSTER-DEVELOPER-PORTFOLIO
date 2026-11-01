# Operations and controls

| Area | Prototype behaviour | Production control needed |
|---|---|---|
| Payments | Displays seeded statuses and values | Authoritative payment service integration and status freshness |
| Treasury | Calculates available = balance minus reserved | Ledger-backed balances, intraday updates and approved thresholds |
| Fraud/AML | Displays synthetic alerts and severities | Governed alert sources, case evidence and human review |
| Reconciliation | Displays an example unmatched statement exception | Source statement ingestion, matching rules and break workflow |
| Alert workflow | Allows acknowledge/investigate/escalate/resolve | Authenticated roles, permitted transitions and maker-checker where required |
| Work queue | Allows status and owner changes | Assignment policy, SLA, escalation and immutable history |
| Audit | Process-local events | Durable, append-only, tamper-evident audit storage |
| Dashboard | Aggregates seeded fixture records | Data lineage, freshness, availability and reconciliation monitoring |

## Operational principles

- A dashboard is an operational view, not a replacement for a payment ledger or compliance case system.
- Display source and last-updated timestamps for every integrated domain.
- Do not silently interpret stale or missing source data as zero.
- Keep the source of record in its owning domain.
- Make all material operator actions attributable and auditable.
- Require human judgement for fraud, AML and compliance outcomes.
- Apply least privilege, segregation of duties and privacy-by-design.
