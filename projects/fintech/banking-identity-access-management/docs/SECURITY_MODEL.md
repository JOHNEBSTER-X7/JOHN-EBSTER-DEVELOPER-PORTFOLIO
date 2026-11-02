# Security model

## Implemented demonstrations
- Scrypt password hashing with per-record salts and timing-safe comparison.
- Random bearer session tokens stored as hashes, expiry and revocation.
- User status lifecycle and revocation of sessions when suspended/disabled.
- Role-based permission catalogue and resource-prefix policy matching.
- Separate security-administrator approval for privileged role changes.
- Scoped, expiring API credentials with hashed storage and revocation.
- Audit events for identity and access operations.

## Explicit gaps
The current HTTP API does not authenticate or authorize administrative routes. The x-actor header is not an identity credential. User IDs supplied in requests are not proof of identity. MFA is an enforcement flag, not a working second factor. No SSO, OIDC/SAML, password reset, rate limiting, lockout, secure cookies, CSRF protection, database, encryption key management, tenant isolation or tamper-resistant audit store is included.

## Production requirements
Add authenticated middleware and server-side authorization on every protected route; integrate a mature identity provider; implement verified MFA and recovery; use durable storage and migrations; configure TLS, secure cookies, CSRF controls, rate limiting and secrets management; add privileged-access monitoring; and obtain independent penetration testing.
