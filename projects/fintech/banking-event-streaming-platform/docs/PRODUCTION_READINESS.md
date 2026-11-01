# Production readiness roadmap

## Prototype delivered

- Local append-only JSONL event log with restart reload.
- Persisted consumer offsets, failure state, schemas and audit entries.
- Idempotent event IDs and monotonically assigned offsets.
- Sequential acknowledgements, consumer lag, pause/resume and retryable failures.
- Role categories for domain producers, consumers and administrators.

## Required before production

1. Replace local files with a replicated durable broker and persistent metadata store.
2. Add multi-node coordination, partitioning, consumer rebalancing and defined ordering guarantees.
3. Implement transactional outbox and idempotent inbox patterns in source and destination services.
4. Implement schema registry compatibility rules, JSON Schema/Avro/Protobuf validation and deprecation policy.
5. Use OAuth2 client credentials or workload identity, mTLS, managed secret storage, rotation, revocation and fine-grained scopes.
6. Add encryption at rest and in transit, data classification, retention and deletion controls.
7. Add structured logs, distributed tracing, queue depth, consumer lag, throughput, error-rate and dead-letter alerts.
8. Add backups, restore testing, disaster recovery, capacity tests and service-level objectives.
9. Validate consumer idempotency and business-level reconciliation. An offset acknowledgement alone does not guarantee exactly-once business processing.
10. Conduct independent security, privacy, resilience and regulatory assurance.

## Portfolio integration sequence

- Publish payment lifecycle events from the payment service.
- Publish liquidity position and threshold events from treasury.
- Publish alert and case lifecycle events from fraud and AML services, minimising sensitive data.
- Publish reconciliation break events.
- Build a consumer projection for the Banking Operations Command Centre.
- Reconcile consumer projections against the owning domain systems and expose data freshness.

The current repository does not connect to Kafka or any of the other portfolio applications. Only the local prototype scope is implemented.
