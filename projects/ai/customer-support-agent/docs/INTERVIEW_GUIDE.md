# Interview guide

## 60-second project explanation

I built a TypeScript and Express customer support agent with a browser chat interface. It retrieves relevant passages from a curated help centre, returns article references, keeps a conversation history and offers escalation when it cannot find a reliable answer. An optional OpenAI integration receives only retrieved context; without credentials, a deterministic fallback keeps the application testable and usable.

## Interview questions

**How do you reduce hallucinations?** The service retrieves approved articles first, instructs the optional model to stay within those excerpts, exposes source references and offers escalation when no relevant content is found. Prompt instructions alone are not a guarantee; production requires evaluation and output checks.

**Why include a fallback?** It makes the core workflow usable without external credentials, controls demo costs and makes tests deterministic.

**How is state managed?** Conversations are keyed by UUID in a process-local Map. This is simple for a prototype but loses state on restart and does not work across multiple server instances. Production would use PostgreSQL or Redis.

**How would you connect a real support desk?** Replace the demo escalation handler with an authenticated adapter for a ticketing platform, using idempotency, retries, audit events and least-privilege credentials.

**What would you improve next?** Add authentication, persistent storage, staff console, tenant isolation, knowledge-base administration, semantic retrieval, response evaluation, human handoff integration and privacy/retention controls.
