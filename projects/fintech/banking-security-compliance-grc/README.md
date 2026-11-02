# Northstar Institutional Banking Security Compliance, GRC & Regulatory Controls

A TypeScript/Express governance, risk and compliance prototype for banking security control management, risk registers, evidence review, audit planning, findings remediation and framework coverage reporting.

## Run
```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

## Capabilities
- Starter control library mapped to illustrative ISO 27001, NIST CSF and PCI DSS references.
- Control ownership, assessment status and review timestamps.
- Inherent and residual risk registers with validated 5x5 scoring.
- Evidence submission and reviewer acceptance/rejection workflow.
- Audit planning and lifecycle tracking.
- Audit findings linked to controls, with remediation and risk acceptance states.
- Framework coverage metrics, dashboard summary and audit trail.
- REST API with Zod request validation.

## Scope
Framework references are indicative mappings for demonstration, not a complete or authoritative interpretation of any standard or regulation. This prototype does not establish compliance, certification, legal advice or regulatory approval. It uses in-memory data, has no production authentication or authorisation, and does not validate evidence authenticity or securely store evidence files. Do not use it as a system of record for regulated obligations.

## Verification
GitHub Actions runs automated tests, TypeScript validation and compilation. A passing build is not a compliance opinion or security certification.