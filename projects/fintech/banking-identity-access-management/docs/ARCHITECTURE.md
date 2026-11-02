# Architecture

The Express API validates request payloads with Zod and delegates domain operations to IdentityService. The service manages user records, password hashes, session token hashes, permission policies, privileged role-change approvals, API-key hashes and actor-labelled audit events.

## Authentication
Passwords are hashed with Node.js scrypt using a random per-password salt. Successful password authentication creates a random bearer token; only its scrypt hash is stored. Sessions expire after eight hours and can be revoked. Suspension and disabling revoke all active sessions.

## Authorization
Built-in role permission sets provide baseline capabilities. Once explicit policies exist, an operation must also match an enabled policy's role, permission and resource prefix. Unmatched requests are denied.

## Privileged changes
Role changes enter a pending approval queue. A different active security administrator must approve or reject the request. Approval updates the target role set and revokes its existing sessions.

## API credentials
API keys are random, scoped and expiry-bound. The plaintext secret is returned only at creation; the stored record contains a hash. Revocation prevents subsequent verification.
