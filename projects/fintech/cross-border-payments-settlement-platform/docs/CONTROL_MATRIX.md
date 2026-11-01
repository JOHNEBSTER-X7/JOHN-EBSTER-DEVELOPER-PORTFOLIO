# Control matrix

| Control | Demonstration behaviour | Production requirement |
|---|---|---|
| Idempotency | Repeated key returns original payment; payload mismatch rejected | Durable, distributed key store and retention policy |
| Currency integrity | Source account currency must match instruction | Currency metadata, precision registry and validation |
| FX control | Accepted, matching, unexpired quote required | Approved market data, quote provenance, executable liquidity and best-execution policy |
| Screening | Synthetic country/name rules can hold payment | Licensed sanctions/PEP/adverse-media data, tuning, false-positive review and audit |
| Maker-checker | Named approval step distinct from fixed API actor | Authenticated users, RBAC, strong identity, segregation of duties |
| Liquidity | Available balance checked and funds reserved | Ledger-backed reservations, concurrency control and intraday liquidity |
| State transitions | Service rejects out-of-sequence actions | Durable state machine, event versioning and recovery procedures |
| Settlement | Explicit simulated settlement step | Authenticated network acknowledgements, finality rules and exception handling |
| Returns | Source reservation released or funds restored | Scheme-specific returns, reason codes, fees and accounting |
| Reconciliation | Reference, currency and amount matching | Multi-dimensional matching, tolerances, breaks workflow and signed source files |
| Audit | Process-local event records | Append-only tamper-evident audit storage and retention controls |
| Message format | Illustrative XML/text generation | ISO 20022 schema validation, network profiles, signing and certification |

This table describes the prototype and a production direction; it is not a compliance certification or control assurance report.
