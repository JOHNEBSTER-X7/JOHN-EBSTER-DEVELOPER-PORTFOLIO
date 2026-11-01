# Northstar Institutional Event Streaming & Banking Data Platform

A TypeScript event-streaming and banking data platform prototype with durable local event storage, versioned event schemas, consumer offsets, explicit acknowledgements, replay, failure tracking and a monitoring dashboard.

> **Scope:** This is a single-node prototype using an append-only JSON Lines file and a JSON state snapshot. It is not Kafka, a distributed broker, a replicated event store or a production banking data platform.

## Capabilities

- Append-only event log stored in `storage/events.jsonl`.
- Persisted consumer state, schema registry and audit data in `storage/state.json`.
- Monotonic event offsets and idempotency by producer event ID.
- Schema registry with domain ownership, major/minor version and required payload fields.
- Six banking domains: payments, treasury, fraud, AML, reconciliation and operations.
- Consumer groups that start from earliest or latest offset.
- Explicit sequential acknowledgements and lag reporting.
- Consumer pause/resume, failure tracking, retryable failures and dead-letter classification.
- Controlled replay for retryable failures.
- Role-scoped API credentials: domain producer, consumer and administrator.
- Responsive monitoring dashboard.

## Run locally

~~~bash
npm install
export STREAM_API_KEYS="payments:replace-pay-key,treasury:replace-treasury-key,fraud:replace-fraud-key,aml:replace-aml-key,reconciliation:replace-recon-key,operations:replace-ops-key,consumer:replace-consumer-key,admin:replace-admin-key"
npm test
npm run typecheck
npm run build
npm run dev
~~~

The service listens on port 3800. Set `PORT` and `EVENT_STORAGE_DIR` to override defaults. Keep real credentials outside source control.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Service and storage mode |
| GET | `/api/stream` | Stream, consumer lag, failures and schema summary |
| GET | `/api/events?after=0&limit=100` | Read events after an offset |
| POST | `/api/events` | Publish a domain-authenticated event |
| GET | `/api/schemas` | Registered schema identifiers |
| POST | `/api/schemas` | Register a schema (admin) |
| POST | `/api/consumers` | Register a consumer group |
| GET | `/api/consumers/:name/poll` | Read pending events |
| POST | `/api/consumers/:name/ack` | Acknowledge next sequential offset |
| POST | `/api/consumers/:name/fail` | Record consumer processing failure |
| POST | `/api/consumers/:name/replay` | Replay retryable failure (admin) |
| POST | `/api/consumers/:name/status` | Pause or resume consumer (admin) |

See [architecture](./docs/ARCHITECTURE.md), [event contract](./docs/EVENT_CONTRACT.md) and [production readiness](./docs/PRODUCTION_READINESS.md).

## Operational limitations

The JSONL log and state snapshot are local files on one process. There is no replication, broker protocol, partitioning, distributed ordering, multi-node coordination, transactional outbox, exactly-once processing, durable remote consumer acknowledgement, schema compatibility engine, encryption-at-rest, managed identity, production secret vault, backup automation or disaster recovery. File persistence is useful for demonstrating restart recovery and basic event-log semantics, but not for institutional throughput or availability. Consumers must make their own processing idempotent.
