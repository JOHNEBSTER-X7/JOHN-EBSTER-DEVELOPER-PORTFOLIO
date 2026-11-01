# Interview guide

## 60-second explanation

I built a multi-agent business workflow orchestrator in TypeScript. A central coordinator passes a business brief through four specialist agents: research theme extraction, business analysis, business writing and structural review. The system produces a traceable deliverable and pauses for a human approval decision. The first release is deterministic and local-first so its behaviour is testable without external AI credentials.

## Questions to prepare for

**What makes this multi-agent?** The workflow is decomposed into specialist roles with separate functions, typed outputs and sequential handoffs coordinated by a central orchestrator.

**Why not let agents execute arbitrary tools?** Unrestricted tool use creates security and business risks. This prototype stops at a reviewed deliverable and models a human approval boundary. Future tools should use allow-lists, least-privilege credentials and per-action authorisation.

**How do you handle agent failure?** The first version uses synchronous deterministic agents and structural checks. Production needs timeouts, retries, failure states, idempotency and durable execution history.

**How is the workflow auditable?** Each agent result records its role, summary, structured output and completion time. Production should persist these records in an append-only audit store.

**How would you add LLMs?** Add a provider interface per agent, pass only necessary context, validate structured outputs, enforce token/cost budgets and evaluate each role independently.
