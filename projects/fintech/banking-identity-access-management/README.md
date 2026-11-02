# Northstar Institutional Banking Identity & Access Management Platform

A TypeScript service demonstrating identity lifecycle management, password authentication, expiring sessions, MFA enforcement state, role-based permissions, resource-scoped policy checks, privileged role approvals, API key lifecycle and audit events.

## Capabilities
- User provisioning with unique username/email checks and minimum password length.
- Password hashing with Node.js scrypt and timing-safe verification.
- Eight-hour bearer sessions, token hashing, logout and session revocation on suspension.
- MFA enforcement state: enabled accounts are blocked from password-only login. This prototype does not implement factor enrolment or OTP verification.
- Role-based permissions for customer, analyst, operator, approver, security administrator and auditor roles.
- Optional resource-prefix policies and default-deny policy evaluation.
- Maker-checker role changes requiring a separate active security administrator.
- Scoped API keys, one-time secret return, hashed storage, expiry and revocation.
- Actor-labelled audit events and operational summary.

## Run locally
Requires Node.js 22 or later.

    npm install
    npm test
    npm run typecheck
    npm run build
    npm run dev

The API listens on port 3000 by default. Set PORT to override.

## Main endpoints
- GET /health and GET /api/summary
- GET/POST /api/users; PATCH /api/users/:id/status
- POST /api/auth/login; POST /api/auth/logout
- PATCH /api/users/:id/mfa
- GET/POST /api/policies; POST /api/authorize
- GET/POST /api/role-approvals; PATCH /api/role-approvals/:id
- GET/POST /api/api-keys; POST /api/api-keys/verify; DELETE /api/api-keys/:id
- GET /api/audit

## Security and operational limitations
Educational prototype only. All state is in-memory and lost on restart. The API currently has no authentication middleware protecting administrative endpoints: actor headers and supplied user IDs are caller-controlled demonstration inputs. The service does not provide production MFA, password reset, account recovery, federation/SSO, device trust, tenant isolation, rate limiting, brute-force protection, CSRF protection, secure cookies, key rotation, durable audit, database persistence or external identity-provider integration. MFA is an enforcement flag only, not a complete second factor. API-key verification is a demonstration endpoint and is not automatically integrated as middleware on protected routes. Do not deploy with real users, credentials or financial data. A production system requires threat modelling, hardened transport and secrets, secure session handling, identity proofing, audited policy enforcement, monitoring, recovery and independent security review.
