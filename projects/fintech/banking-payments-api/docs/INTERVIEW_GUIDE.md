# Interview guide

## How do you prevent payments before onboarding approval?

The service requires both customer and merchant records to exist and have approved review states before creating a payment record. In a production system, those checks and payment creation must share a transaction or robust state/version strategy.

## Why idempotency?

Clients retry after timeouts and uncertain network outcomes. The idempotency key maps retries to the original payment object. This in-memory map is demonstrative; production requires a unique database constraint, request fingerprint validation and documented retention policy.

## How is risk scored?

The example uses transparent deterministic rules: transaction amount and cross-border status. High-risk transactions remain authorised and create an alert. This is not a fraud detection model and should not be used for real decisions.

## What would you improve?

1. Persist all records in PostgreSQL with atomic transactions.
2. Integrate a licensed payment provider using a provider abstraction.
3. Verify signed webhooks and handle out-of-order/replayed events.
4. Add role-based access and dual control for refunds and dispute decisions.
5. Add evidence upload, dispute deadlines and reconciliation.
6. Replace demo KYC with appropriately governed identity and screening providers.
7. Add monitoring, alerting, retention controls, data minimisation and security testing.

## Scope honesty

This is a tested simulation API, not a bank, regulated payment institution or live payment processor. No real KYC, money movement, card processing or sanctions screening takes place.
