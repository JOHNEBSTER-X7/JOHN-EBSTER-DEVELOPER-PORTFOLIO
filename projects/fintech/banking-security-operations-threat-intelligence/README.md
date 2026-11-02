# Northstar Institutional Banking Security Operations & Threat Intelligence

A TypeScript/Express security-operations prototype for event monitoring, explainable detections, threat indicators, incident response workflows and vulnerability tracking.

## Run
```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

## Capabilities
- Validated security-event ingestion with external-ID deduplication.
- Configurable detection rules with explainable matched-rule IDs and severity scores.
- IP, domain and hash threat indicators with confidence and source attribution.
- Automatic incident creation for high/critical detections; analyst-owned incident lifecycle and notes.
- Vulnerability register with CVSS validation and remediation states.
- Dry-run response playbooks for evidence collection, owner notification and asset-isolation simulation.
- Audit trail, operational summary and REST API.

## API
`POST /api/events`, `GET /api/events`, `GET /api/summary`, `/api/rules`, `/api/indicators`, `/api/incidents`, `/api/vulnerabilities`, `GET /api/audit`. See `src/app.ts` for request schemas.

## Safety and scope
This is a demonstration system using in-memory storage and synthetic/manual inputs. It is not a SIEM replacement, managed threat-intelligence feed, EDR, vulnerability scanner or certified banking control. Response playbooks are simulations and do not block accounts, isolate endpoints, send notifications or change infrastructure. No production authentication, authorization, tenant isolation, durable database, encryption-at-rest, tamper-evident audit, secrets management, rate limiting, alert delivery or external integrations are implemented. Detection scores are illustrative heuristics, not validated threat probabilities. Do not ingest real customer data or rely on this prototype for security decisions.

## Verification
Automated tests and GitHub Actions verify the implemented prototype. Passing CI does not constitute a security audit or production-readiness assessment.

CI workflow: [Banking Security Operations CI](../../../.github/workflows/banking-security-operations-ci.yml).