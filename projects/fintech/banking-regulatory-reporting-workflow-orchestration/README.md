# Northstar Institutional Banking Regulatory Reporting Automation & Workflow Orchestration

A TypeScript/Express workflow engine demonstrating reporting schedules, task orchestration, dependency controls, evidence checkpoints, reporting-pack generation, independent review, approval and controlled submission records.

## Run locally
```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

## API
- `GET /health`, `GET /api/dashboard`
- `GET /api/obligations`
- `GET|POST /api/workflows`
- `PATCH /api/workflows/:id/tasks/:taskId`
- `POST /api/workflows/:id/reporting-pack`
- `POST /api/workflows/:id/approve`
- `POST /api/workflows/:id/submit`
- `GET /api/audit-trail`

Pass `x-actor` to label demo audit events. This is not authentication.

## Workflow
Each scheduled obligation creates eight dependent tasks: scope confirmation, data collection, validation, reconciliation, exception/evidence disposition, reporting-pack preparation, independent review and controlled approval. The pack cannot be generated before core tasks are completed. Review and approval enforce separation from the initial preparer. Submission is recorded only after approval.

## Limitations
Synthetic obligation catalogue; in-memory state; no live deadline scheduler, notifications, regulatory source feeds, data validation/reconciliation connectors, document storage, authentication/RBAC, regulator API or actual filing. Submission records a local event only. Not for live regulatory reporting or compliance decisions.
