# Northstar Banking Integration Gateway & Event Bus

A TypeScript/Express integration gateway prototype for standardising events from banking domains and routing them to named downstream consumers.

> **Simulation boundary:** this gateway currently routes events in memory to simulated consumer destinations. It does not make outbound calls to the separate portfolio projects, use a real message broker, persist events or guarantee remote delivery.

## Features

- Versioned event envelope with source domain, correlation ID and subject ID.
- Six domain producers: payments, treasury, fraud, AML, reconciliation and operations.
- Domain-scoped bearer API credentials configured through environment variables.
- Constant-time credential comparison.
- Strict Zod validation and source/event namespace checks.
- Event ID idempotency and duplicate response handling.
- Consumer routing declarations and delivery records.
- Retry handling and dead-letter status after the configured attempt limit.
- Audit events for publication, routing and retries.
- Health and integration summary endpoints.

## Run locally

~~~bash
npm install
export INTEGRATION_API_KEYS="payments:replace-this,treasury:replace-that,fraud:replace-this-too,aml:replace-this-too,reconciliation:replace-this-too,operations:replace-this-too"
npm test
npm run typecheck
npm run build
npm run dev
~~~

The server listens on port 3700 by default. Set PORT to override it. Use unique, high-entropy credentials outside development and never commit real keys.

## Publish an event

~~~bash
curl -X POST http://localhost:3700/api/events \
  -H 'Authorization: Bearer payments:replace-this' \
  -H 'Content-Type: application/json' \
  -d '{"eventId":"evt-pay-000001","eventType":"payments.payment.status_changed","schemaVersion":"1.0","source":"payments","occurredAt":"2026-11-01T10:00:00.000Z","correlationId":"corr-001","subjectId":"payment-001","payload":{"status":"settled","currency":"GBP","amountMinor":125000}}'
~~~

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Health and mode |
| GET | /api/summary | Domain and delivery metrics |
| GET | /api/events | Accepted events |
| GET | /api/events/:id | Event lookup |
| POST | /api/events | Authenticated event ingestion |
| GET | /api/deliveries | Delivery records |
| GET | /api/dead-letter | Dead-letter records |
| POST | /api/deliveries/:id/retry | Authenticated retry operation |
| GET | /api/audit | Audit records |

See the event contract, architecture and production hardening roadmap in docs/.

## Production hardening required

The current API-key mechanism is a learning implementation, not institutional-grade identity. Before production, add OAuth2 client credentials or workload identity, mTLS, secret rotation, rate limiting, request signing, persistent idempotency storage, a durable broker, transactional outbox/inbox, schema registry, consumer acknowledgements, exponential backoff with jitter, dead-letter replay tooling, observability, encryption, data retention and disaster recovery. Consumer delivery statuses are simulated; no remote acknowledgements occur.
