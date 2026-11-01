# Northstar Enterprise Banking & Payments API

A portfolio prototype modelling customer and merchant onboarding, simulated KYC review, payment lifecycle, risk scoring, refunds, chargeback disputes and compliance alert handling.

## Features

- Customer and merchant onboarding with pending/approved/rejected review states.
- Explicit simulated human KYC review gate; no identity verification provider is connected.
- Payment initiation gated on both parties being approved.
- Idempotency keys for safe request retries in the in-memory demonstration.
- Deterministic transaction risk scoring with explainable reasons and compliance alerts.
- High-risk payments remain authorised until a separate settlement action is submitted.
- Full refund workflow and dispute opening/review outcomes.
- Compliance alert review endpoint and operational metrics.
- Express, TypeScript, Zod, Vitest and Supertest.

## Run locally

Requires Node.js 22+.

    npm install
    npm run dev

API listens on port 3420 by default.

## Test and build

    npm run typecheck
    npm test
    npm run build

## API routes

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | Service health |
| GET | /api/metrics | Operational counters |
| GET/POST | /api/parties | List or onboard customers and merchants |
| POST | /api/parties/:id/kyc-review | Record a simulated manual review |
| GET/POST | /api/payments | List or initiate simulated payments |
| POST | /api/payments/:id/settle | Settle an authorised payment |
| POST | /api/payments/:id/refunds | Issue a full simulated refund |
| POST | /api/payments/:id/disputes | Open a simulated chargeback |
| POST | /api/disputes/:id/review | Record dispute outcome |
| GET | /api/compliance/alerts | List risk and onboarding alerts |
| POST | /api/compliance/alerts/:id/review | Mark alert reviewed |

## Risk rules

The sample deterministic scoring rules flag transactions at or above £10,000 as high risk and cross-border transactions as elevated risk. The rules are illustrative only, not a calibrated fraud model, sanctions screening or AML control. A score is not a decision that a customer is fraudulent.

## Critical scope and safety limitations

This software does not connect to a bank, card network, payment service provider, identity provider or sanctions database. It does not transfer, receive, safeguard or hold real funds. KYC is a simulated human decision. Payment, refund and chargeback state transitions are internal demo records only.

Data is in memory and resets when the process restarts. There is no authentication, authorisation, tenant isolation, persistent database, webhook signature validation, real payment settlement, partial refunds, dispute evidence exchange, regulatory reporting or production audit retention. Never submit real personal, identity, card or bank data.

A production financial service requires jurisdiction-specific legal and regulatory analysis, provider contracts, secure persistent transactional storage, strong access controls, operational resilience, privacy engineering, fraud/AML controls and independent security/compliance review.
