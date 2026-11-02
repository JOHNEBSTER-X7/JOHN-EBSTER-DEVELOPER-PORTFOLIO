# Northstar Institutional Banking Network Security & Zero Trust Architecture

A TypeScript/Express prototype demonstrating identity-aware network access decisions, device trust assessment, service identities, network segmentation policies, flow evaluation and audit reporting.

## Run
```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

## Capabilities
- Device registration and trust assessment based on management and compliance signals.
- Workload identities using SPIFFE-style identifiers and zone association.
- Network segmentation policies scoped by source/destination zone, ports, optional service identity and device trust.
- Default-deny flow evaluation with explicit policy match and decision reasons.
- Network flow history, segmentation matrix, operational summary and audit trail.
- REST API with Zod request validation.

## API
- `POST /api/devices`, `GET /api/devices`, `PATCH /api/devices/:id/assessment`
- `POST /api/service-identities`, `GET /api/service-identities`, `PATCH /api/service-identities/:id`
- `POST /api/policies`, `GET /api/policies`, `PATCH /api/policies/:id`
- `POST /api/flows/evaluate`, `GET /api/flows`
- `GET /api/segmentation/matrix`, `GET /api/summary`, `GET /api/audit`

## Scope and limitations
This is a simulation prototype, not a network firewall, NAC, service mesh, identity provider or production Zero Trust enforcement plane. It stores data in memory, does not authenticate API callers, does not validate real device posture, issue or verify cryptographic workload certificates, inspect packets, configure network controls or integrate with cloud/network vendors. Device trust scores are illustrative. Policies are evaluated only against submitted flow metadata. Do not rely on it to protect banking systems.

## Verification
GitHub Actions runs automated tests, TypeScript validation and compilation. CI success is not a security audit or production readiness certification.