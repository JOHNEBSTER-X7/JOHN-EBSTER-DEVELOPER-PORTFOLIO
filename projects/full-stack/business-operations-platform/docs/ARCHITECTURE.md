# Architecture

The Express API exposes contact, task, workflow and dashboard resources. Zod validates inbound payloads. A small in-memory store models entities and records activity events.

## Workflow lifecycle

A request to create a sales, support or research workflow is passed to a deterministic template function. The recommendation and a task are stored together. The task begins as pending_approval. A human may approve or reject it. Only an approved task can transition to completed. Repeated approval decisions are rejected.

## Data model

- Contact: identity, company, unique email and lifecycle status.
- Task: title, description, assignee, priority, optional contact, status and timestamps.
- Workflow: type, input, recommendation, task reference and status.
- Activity: timestamped event record.

## Production evolution

Replace in-memory maps with PostgreSQL and Prisma; add authenticated users, RBAC, tenant scoping, audit persistence, idempotency, background queues, notification integrations, observability and data retention controls. Add provider-backed LLM adapters behind explicit policy and approval boundaries.
