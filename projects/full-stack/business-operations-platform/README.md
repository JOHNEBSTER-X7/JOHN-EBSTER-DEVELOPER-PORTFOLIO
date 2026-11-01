# Northstar Enterprise Business Operations Platform

A full-stack business workspace combining a lightweight CRM, task management, human approval gates and AI-assisted workflow templates.

## Capabilities

- Contact register with duplicate email protection and lifecycle statuses.
- Sales follow-up, customer support and research-brief workflow templates.
- Workflow recommendations create reviewable tasks, never send messages or execute external actions.
- Explicit approve/reject gate; only approved tasks can be completed.
- Operational metrics, activity feed and browser dashboard.
- REST API built with TypeScript, Express and Zod.
- Security headers, bounded JSON requests, rate limits and automated tests.

## Run locally

Requires Node.js 22+.

    cd projects/full-stack/business-operations-platform
    npm install
    npm run dev

Open http://localhost:3300.

## Checks

    npm run typecheck
    npm test
    npm run build

## API

| Method | Route | Purpose |
|---|---|---|
| GET | /api/health | Health check |
| GET | /api/dashboard | Metrics and recent activity |
| GET/POST | /api/contacts | List and create contacts |
| PATCH | /api/contacts/:id | Update lifecycle status |
| GET/POST | /api/tasks | List and create tasks |
| POST | /api/tasks/:id/approval | Approve or reject task |
| POST | /api/tasks/:id/complete | Complete an approved task |
| GET/POST | /api/workflows | List and generate workflow drafts |
| GET | /api/activities | Activity feed |

## Workflow safety

This prototype generates deterministic recommendations, not independent autonomous agents. Workflow creation creates a task in pending_approval state. Approval is an explicit API/UI action. The application does not send email, contact customers, create third-party tickets, initiate payments or perform external business actions.

## Limitations

- Data is stored in process memory and is lost on restart.
- No authentication, role-based access control, multi-tenant isolation or persistent database.
- Workflow recommendations are templates, not LLM-generated advice.
- No external CRM, email, helpdesk or research integrations.
- Not suitable for production customer data or regulated workflows without security, privacy and operational engineering.

This is a portfolio prototype demonstrating API design, typed business logic, state transitions, human-in-the-loop controls and test automation.
