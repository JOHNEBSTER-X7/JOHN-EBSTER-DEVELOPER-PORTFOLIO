# Production readiness

| Capability | Prototype | Production requirement |
|---|---|---|
| Passwords | Scrypt hashes | Mature identity provider, policy and breach checks |
| Sessions | Hashed random bearer tokens | Secure cookie/session architecture, rotation and device controls |
| MFA | Enforcement flag only | Verified TOTP/WebAuthn/passkeys and recovery |
| Authorization | Role and resource-prefix checks | Authenticated middleware, central policy decision and enforcement |
| Privileged access | Separate administrator approval | Just-in-time access, dual control and session recording |
| API keys | Hashed, scoped and revocable | Vault-backed lifecycle, rotation and route middleware |
| Persistence | In-memory | Durable database, backups and disaster recovery |
| Audit | In-memory actor labels | Tamper-evident, protected audit pipeline |
| Assurance | Automated tests | Threat model, penetration test and operational certification |

Never use this prototype for real banking identities or credentials. It is not a certified IAM product.
