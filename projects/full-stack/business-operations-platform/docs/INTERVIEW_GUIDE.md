# Interview guide

## 60-second explanation

I built a business operations workspace with a CRM, task queue, workflow studio and approval controls. Users can generate structured sales, customer support or research workflow drafts. Each draft creates a task that must be explicitly approved before completion. The API is typed and validated, and the dashboard reports operational metrics and activity.

## Questions

**Are these autonomous AI agents?** No. The current implementation uses deterministic workflow templates. It demonstrates orchestration boundaries and human approval; a future provider-backed LLM layer could be added behind interfaces.

**How is approval enforced?** New tasks are pending_approval. Only approved tasks may transition to completed. Repeated decisions are rejected with a conflict response.

**How would you scale it?** PostgreSQL persistence, Redis-backed queues, stateless API replicas, tenant-scoped authorization, idempotency and event-driven integrations.

**What is missing for production?** Authentication, RBAC, persistent storage, audit trail, tenant isolation, privacy controls and real CRM/helpdesk integrations.
