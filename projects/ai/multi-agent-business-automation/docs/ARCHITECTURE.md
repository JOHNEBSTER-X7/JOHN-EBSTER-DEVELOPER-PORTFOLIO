# Architecture

## Orchestration sequence

`POST /api/workflows` validates a business goal and passes it through a fixed sequential graph:

`Research → Business Analyst → Business Writer → Quality Reviewer → Human Approval`

Each agent receives the original goal and prior agent outputs. Agent outputs use a shared typed envelope containing agent name, completion status, summary, structured output and completion timestamp.

## Workflow state machine

- `needs_approval`: all agents have completed and a pending approval record exists.
- `completed`: a human has approved the workflow state.
- `rejected`: a human has rejected the workflow, or the reviewer check fails.

An approval decision is single-use. The demo does not execute external side effects after approval.

## API layers

- Express routes validate inputs with Zod.
- Orchestrator owns workflow lifecycle and state transitions.
- Specialist agent functions each own one responsibility.
- In-memory Map stores workflow objects for the current process.
- Static dashboard calls the API and displays state.

## Production hardening

Move workflow state to PostgreSQL, add authentication and role-based authorisation, record immutable audit events, implement workflow idempotency and cancellation, and place integrations behind allow-listed adapters. External actions should require scoped approvals, signed action payloads and server-side policy checks. Agent text must always be treated as untrusted input.
