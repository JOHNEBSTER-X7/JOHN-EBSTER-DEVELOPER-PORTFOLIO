# Security model and gaps

| Area | Prototype control | Production gap |
|---|---|---|
| Consent | Client, account, scope, expiry and revocation checks | Cryptographically protected authorisation and consent management |
| Client binding | Client identifier compared to stored grant | OAuth 2.0 client authentication and sender-constrained access tokens |
| Transport | Local Express API | TLS, mTLS/FAPI profile, certificate lifecycle |
| Payment replay | Per-client idempotency key | Durable, atomic idempotency across distributed services |
| Customer identity | Seeded user IDs | Strong authentication and SCA |
| Access control | Consent scope checks | Full user, client and operator authorisation |
| Audit | In-memory event list | Immutable retained audit and alerting |
| Fraud | Simple threshold rules | Validated monitoring, analyst procedures and regulatory obligations |

This repository is not a certified Open Banking implementation and must not be connected to live banking credentials.
