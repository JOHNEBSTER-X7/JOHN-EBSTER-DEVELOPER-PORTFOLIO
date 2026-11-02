# Access control and privileged workflows

## Roles
- customer: own profile read/write demonstration.
- analyst: profile and payment read.
- operator: profile read/write and payment read.
- approver: payment read and approval.
- security_admin: user, policy, API-key and audit administration.
- auditor: audit and profile read.

These are illustrative role templates, not a recommended final bank role matrix.

## Policy matching
An enabled policy must match the user's role, requested permission and resource prefix. The resource prefix may be a path prefix or wildcard `*`. When no explicit policies exist, the built-in role matrix applies. When policies are configured, a matching policy is additionally required.

## Maker-checker
A role-change requester cannot approve their own request. Approval requires a separate active security administrator. Approved changes revoke the target user's existing sessions.

## API keys
Keys have explicit scopes and expiry. Plaintext is returned once at creation; only a derived hash is retained. Revocation is supported. Route-level integration is not yet implemented.
