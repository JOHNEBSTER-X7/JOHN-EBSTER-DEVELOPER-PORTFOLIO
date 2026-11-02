# Northstar Institutional Banking Data Security & Privacy Management Platform

A TypeScript service demonstrating a control plane for data access, consent, retention, privacy requests and security incident workflows.

## Capabilities
- Dataset-, role-, action- and purpose-scoped access policy catalogue with explicit deny-by-default evaluation.
- Consent records with latest-decision and expiry checks.
- Retention schedules, elapsed-period assessment and legal-hold override.
- Field-level demo masking for nominated sensitive attributes.
- Privacy request lifecycle for access, rectification, erasure, restriction and portability.
- Access request submission, approval/rejection and optional expiry.
- Security incident lifecycle with controlled state transitions.
- Actor-labelled audit events and summary endpoints.
- Express REST API with Zod input validation.

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
- GET/POST /api/policies; POST /api/access/evaluate
- POST /api/consents; GET /api/consents/check
- POST /api/retention; POST /api/retention/eligibility
- POST /api/masking
- GET/POST /api/privacy-requests; PATCH /api/privacy-requests/:id
- GET/POST /api/access-requests; PATCH /api/access-requests/:id
- GET/POST /api/incidents; PATCH /api/incidents/:id
- GET /api/audit

## Important limitations
This is an educational prototype, not a production security product or legal-compliance certification. State is in-memory and is lost on restart. It does not authenticate users, enforce real infrastructure permissions, encrypt data, discover sensitive data, securely tokenize values, erase source records, or connect to identity providers, key-management systems, DLP, SIEM, cloud storage or banking systems. Masking is a display transformation, not cryptographic protection. Consent and privacy-request records are workflow examples, not legal determinations. Retention eligibility is advisory and never deletes records automatically. The audit log is in-memory and not tamper-evident. A real deployment requires threat modelling, durable storage, access-control middleware, cryptographic key management, operational monitoring, independent security review and jurisdiction-specific legal advice.
