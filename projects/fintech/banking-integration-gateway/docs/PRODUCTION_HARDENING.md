# Production hardening roadmap

## Prototype delivered

- Domain-scoped bearer credentials from environment configuration.
- Event schema validation and source namespace enforcement.
- In-memory event ID deduplication.
- Simulated consumer routing, delivery records, retry and dead-letter state.
- Audit records and automated tests.

## Identity and edge security

Replace static shared keys with OAuth2 client credentials or workload identity. Add mTLS, managed secrets, rotation, revocation, rate limiting, request signing, network policy and per-event-type permissions. Conduct threat modelling and independent security testing.

## Durable event delivery

Adopt a durable broker such as Kafka, RabbitMQ or a cloud-native equivalent. Implement transactional outbox and idempotent inbox patterns, persistent event IDs, consumer acknowledgements, exponential backoff with jitter, poison-message quarantine and controlled replay. Define ordering and partition keys per business aggregate.

## Governance and observability

Use a schema registry with compatibility rules. Add trace propagation, metrics, structured logs and distributed tracing. Monitor queue depth, consumer lag, retries, dead-letter volume and event freshness. Define encryption, retention, privacy, backups, recovery objectives and disaster-recovery exercises.

## Portfolio domain integration sequence

1. Payments publishes lifecycle events from its authoritative service.
2. Treasury publishes liquidity and settlement position events.
3. Fraud and AML publish alert/case lifecycle events with sensitive details minimised.
4. Reconciliation publishes matched and unmatched break events.
5. Banking Operations consumes these into a read model and exposes source freshness.
6. Consumers acknowledge processing and publish resulting events.

Do not share databases. Use documented APIs and event contracts, preserve domain ownership and reconcile projections against authoritative systems. Only the prototype phase is implemented here.
