# Architecture

Express routes validate request shapes with Zod and delegate domain operations to GovernanceService. The service maintains in-memory dataset metadata, versioned schemas, quality rules, validation findings, stewardship issues, lineage edges and an audit trail.

Dataset registration -> schema draft -> approval -> quality-rule registration -> record validation -> issue remediation. Lineage links registered datasets with directed relationships. This implementation does not automatically infer lineage or connect to the warehouse/event-streaming projects.
