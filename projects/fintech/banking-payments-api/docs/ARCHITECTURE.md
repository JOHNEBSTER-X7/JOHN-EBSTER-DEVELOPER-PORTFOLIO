# Architecture

The Express application validates requests with Zod and delegates domain transitions to BankingPlatform.

- `app.ts`: HTTP routing, request validation and error mapping.
- `platform.ts`: in-memory entity, payment, refund, dispute and alert state; deterministic domain rules.
- `types.ts`: typed domain records.
- `server.ts`: runtime entry point.

## Payment lifecycle

A payment request requires an approved customer and approved merchant. A low- or medium-risk payment is represented as settled in this simulation; a high-risk payment remains authorised until an explicit settle call. This is not a network authorisation or bank settlement.

## Onboarding

New parties begin pending. An operator submits an explicit approved or rejected decision with a reviewer reference. This is a workflow demonstration and does not verify identity, beneficial ownership, sanctions, PEP status or source of funds.

## Risk and alerts

A small deterministic ruleset uses amount and country differences. It is explainable and testable but has no training data, calibration or predictive performance claims. Alerts are reviewable demo records.

## Refunds and disputes

Only one full refund is supported. Disputes have an open state and can be marked won or lost by a simulated reviewer. These state changes do not invoke a card scheme, acquirer or bank.

## Production evolution

Move state to PostgreSQL and enforce atomic idempotency and state transitions in transactions. Add authentication, role-based access, maker-checker approvals, immutable audit events, provider adapters, webhook signature validation, reconciliation, partial refunds, evidence workflows, secrets management and observability.
