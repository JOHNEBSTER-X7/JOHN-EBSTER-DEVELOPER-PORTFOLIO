# Architecture

## Consent boundary
A customer authorises a client identifier for selected accounts and scopes with a bounded duration. Account aggregation and transaction retrieval check consent status, client binding, scope and account membership. Expired consents are transitioned to expired on access; revocation blocks subsequent access.

## Account information
The account register models multiple providers and currencies. The aggregator returns only accounts included in the consent. Transaction records include category, merchant, reference and booking timestamp.

## Payment initiation
Payment requests require the payments:write scope and an account covered by the consent. An idempotency key prevents duplicate accepted payment records for a client. Available funds are reserved on acceptance. Completion reduces the simulated account balance; rejection releases the reservation.

## Risk and reconciliation
Simple rules flag unusually large debit activity. Alerts can be marked reviewed. Reconciliation compares statement references with internal transaction references and reports matched, unmatched and missing items.

## Production evolution
Use a real identity provider, OAuth 2.0 authorisation code flow, FAPI security profile, mutual TLS or approved sender-constrained tokens, signed requests where required, consent UI, strong customer authentication, bank APIs, payment scheme integrations, secure secrets, durable database transactions, idempotent distributed processing, immutable audit, privacy controls and operational monitoring. Implement regulatory permissions and security certification before production.
