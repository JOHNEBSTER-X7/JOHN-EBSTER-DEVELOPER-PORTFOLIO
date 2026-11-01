# Interview guide

## Explain double-entry bookkeeping

A journal records equal debit and credit totals. Each line affects one account, and the account classification determines its normal balance. The implementation uses integer minor currency units to avoid floating-point rounding errors.

## Why idempotency?

Payment and ledger clients retry requests after timeouts. An idempotency key prevents the same logical request from creating multiple journal records. The production implementation would require a database uniqueness constraint and transaction boundary.

## What would you improve?

1. Persist accounts, journal headers and journal lines in PostgreSQL.
2. Post journals inside a serializable database transaction.
3. Add immutable audit events and maker-checker approval.
4. Implement statement matching by amount, currency, date and external reference.
5. Add authentication, role-based permissions and tenant isolation.
6. Add monitoring, alerting, backups, disaster recovery and independent controls testing.

## Be precise about scope

This implementation is a tested in-memory portfolio API. It is not a live payment rail, production ledger or regulated banking system.
