# Governance, controls and limitations

## Prototype controls
- Schema validation at the HTTP boundary.
- Batch ID idempotency.
- Integer minor-unit monetary representation.
- Currency-separated aggregates.
- Basic data-quality exceptions.
- Source lineage and ingestion audit events.

## Not implemented
- Durable warehouse storage, backups, disaster recovery or high availability.
- Data catalog, schema evolution and contract compatibility.
- Authentication, authorisation, tenant isolation or row-level security.
- Encryption, secrets management, privacy controls, retention and deletion workflows.
- Streaming/CDC connectors, scheduling, orchestration, reconciliation to authoritative ledgers or data observability alerts.
- Regulatory-specific calculation rules, attestations, filing generation or regulator submission.
- Independent model validation, financial audit or compliance certification.

Do not use this prototype for real customer data, financial decisions, regulatory submissions or production banking operations.
