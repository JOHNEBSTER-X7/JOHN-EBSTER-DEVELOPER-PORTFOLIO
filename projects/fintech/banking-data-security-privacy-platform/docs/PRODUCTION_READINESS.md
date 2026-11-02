# Production readiness assessment

| Area | Prototype status | Production requirement |
|---|---|---|
| Policy evaluation | Exact-match demonstration | Central policy engine, versioning, conflict and bypass tests |
| Identity | Untrusted actor label | SSO, MFA, service identity and lifecycle controls |
| Persistence | In-memory | Durable database, backup, recovery and migrations |
| Encryption | Not implemented | Managed encryption in transit/at rest and KMS/HSM |
| Masking | Display redaction | Approved irreversible masking/tokenisation design |
| Consent | Simple latest-record check | Jurisdiction-aware purpose and lawful-basis governance |
| Retention | Advisory date calculation | Legal review, records schedules and controlled disposal |
| Privacy requests | Workflow tracking | Identity verification and source-system orchestration |
| Audit | In-memory events | Protected, tamper-evident retention |
| Assurance | Automated tests | Threat model, penetration test, operational and legal review |

Do not deploy with real personal, customer or financial data. No regulatory certification or legal compliance claim is made.
