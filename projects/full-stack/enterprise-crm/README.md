# Northstar CRM — Enterprise Contact & Sales Workspace

A full-stack CRM portfolio project built with Next.js App Router, TypeScript, PostgreSQL and Prisma. It demonstrates contact lifecycle management, server-side filtering, validation and database-backed REST endpoints.

## Features

- Contact creation, listing, search and status filtering.
- Contact status updates and deletion.
- PostgreSQL persistence through Prisma ORM.
- Zod request validation and normalised email addresses.
- Duplicate-email conflict handling and consistent HTTP errors.
- Responsive CRM dashboard and contact summary metrics.
- GitHub Actions type-check workflow.

## Stack

- Next.js 15 / React 19
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod

## Local setup

Requirements: Node.js 20+, npm and PostgreSQL.

```bash
npm install
cp .env.example .env
```

Set `DATABASE_URL` in `.env` to a PostgreSQL database you control, then run:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

Open `http://localhost:3000`.

## Database model

The `Contact` model stores names, unique email, company, job title, phone, notes, status and timestamps. Status values are `LEAD`, `QUALIFIED`, `CUSTOMER` and `INACTIVE`.

## API

| Method | Endpoint | Behaviour |
|---|---|---|
| GET | `/api/contacts` | List contacts; optional `q` and `status` filters |
| POST | `/api/contacts` | Validate and create a contact |
| PATCH | `/api/contacts/{id}` | Partially update a contact |
| DELETE | `/api/contacts/{id}` | Delete a contact |

## Checks

```bash
npm run typecheck
npm run build
```

The repository CI workflow runs the TypeScript check. A successful CI run is the evidence for the current commit; do not infer successful deployment from a passing type check.

## Security and production gaps

**This is a portfolio prototype, not a production-ready CRM.** API routes currently have no authentication or authorisation. Before real customer data is used, add secure identity/session management, tenant isolation, role-based access control, CSRF protections where applicable, rate limiting, audit logs, privacy/retention controls, backups, monitoring and deployment secrets management. The demo should be run with synthetic data only.

## Suggested next increments

1. Authentication and tenant-scoped access.
2. Companies and sales opportunities with pipeline stages.
3. Activity timeline, tasks and reminders.
4. CSV import/export with validation.
5. Integration tests using a disposable PostgreSQL database.
6. Deployment with migrations, health checks and observability.
