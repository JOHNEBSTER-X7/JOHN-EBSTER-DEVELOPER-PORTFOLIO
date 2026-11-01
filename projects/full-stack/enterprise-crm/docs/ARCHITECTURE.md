# Architecture

## Request flow

The browser renders the Next.js client dashboard. It calls route handlers under `src/app/api/contacts`. Route handlers validate incoming JSON with Zod, use the shared Prisma client and persist records in PostgreSQL. Responses are JSON and use HTTP status codes for validation, conflicts and missing records.

## Layers

- Presentation: React client page and responsive CSS.
- HTTP: Next.js route handlers.
- Validation: Zod schemas.
- Data access: Prisma Client singleton.
- Persistence: PostgreSQL Contact model.

## Design choices

The app uses server-side filtering so the browser does not need to download the entire contact table. The API caps list responses at 100 records. Email is normalised to lowercase before insertion. A database unique constraint is the final guard against duplicate email addresses.

## Trust boundaries and limitations

There is no authentication or tenant boundary in this first iteration. Every API route is therefore intended for local demo use only. Do not expose this version to the public internet with real data. A production implementation must authenticate every request and scope every query to an authorised tenant.
