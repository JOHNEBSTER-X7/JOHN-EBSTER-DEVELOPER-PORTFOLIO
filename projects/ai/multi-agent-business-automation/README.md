# Northstar Multi-Agent Business Automation

A human-supervised workflow orchestrator that coordinates four specialist agents—research, business analysis, writing and quality review—to transform a business brief into a structured deliverable.

## Features

- Four sequential specialist agents with explicit inputs and outputs.
- Central workflow orchestrator and workflow status tracking.
- Structured business brief generated from the supplied objective.
- Reviewer agent checks completeness and approval boundaries.
- Human approval/rejection gate before workflow is marked complete.
- Browser dashboard showing agent steps, deliverable and workflow history.
- Express API, Zod validation, Helmet headers and rate limiting.
- Deterministic local execution; no paid AI credentials required.

## Run locally

Requires Node.js 22 or later.

```bash
cd projects/ai/multi-agent-business-automation
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:3100.

## Commands

```bash
npm run typecheck
npm test
npm run build
npm start
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/agents` | List specialist agents |
| POST | `/api/workflows` | Run a multi-agent workflow |
| GET | `/api/workflows` | List current-session workflows |
| GET | `/api/workflows/{id}` | Read a workflow |
| POST | `/api/workflows/{id}/approval` | Approve or reject a workflow |

Example request:

```json
{"goal":"Prepare a customer retention strategy for an online retailer."}
```

## Agent design

1. **Research Agent:** extracts objective themes from the submitted brief. It does not access external sources.
2. **Business Analyst Agent:** derives initial objectives, assumptions and risks.
3. **Business Writer Agent:** creates a structured business brief.
4. **Quality Reviewer Agent:** checks that the deliverable includes the objective, next steps and human approval boundary.

The agents are deterministic functions in this first release. They demonstrate orchestration and traceable handoffs, not autonomous external research or independently verified business intelligence.

## Human approval boundary

The workflow is always created in `needs_approval`. An authorised human can approve or reject its state through the API/UI. Approval does not send an email, publish content, spend money, alter a CRM or execute another external action. Real integrations must be implemented separately with authentication, least-privilege credentials, audit logs and explicit per-action approval.

## Limitations

- Workflow state is held in process memory and disappears on restart.
- No authentication, user roles, tenant isolation or persistent database.
- No external tools, web browsing or third-party business actions.
- Agent outputs are generated from the supplied brief only.
- Reviewer checks are structural, not factual, legal or financial verification.
- The approval UI is a demo and must not be treated as a production authorisation system.

## Next milestones

- Add durable workflow persistence and authenticated user roles.
- Add optional model-backed agents with per-agent budgets and trace logging.
- Add tool adapters with strict allow-lists and approval requirements.
- Add retry policies, timeouts, cancellation and workflow replay.
- Add evaluation datasets for task completion, factuality and safe tool use.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/INTERVIEW_GUIDE.md](docs/INTERVIEW_GUIDE.md).

## Licence

MIT. See the repository-level licence.
