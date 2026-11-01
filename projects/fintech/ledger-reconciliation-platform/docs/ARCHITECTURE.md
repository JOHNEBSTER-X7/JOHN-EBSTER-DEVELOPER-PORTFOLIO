# Architecture

The API separates HTTP validation from ledger domain rules.

- app.ts validates untrusted request payloads with Zod and maps domain errors to HTTP responses.
- store.ts owns account, journal and idempotency state.
- types.ts defines the domain contracts.
- server.ts starts the Express application.

## Double-entry invariant

Every accepted journal must contain at least two lines, all lines must reference existing accounts in the journal currency, each line must contain either a debit or a credit, and total debit minor units must equal total credit minor units. The store rejects unbalanced entries before appending a journal.

Balances are derived from posted journal lines. Assets and expenses are debit-normal; liabilities, revenue and equity are credit-normal.

## Idempotency

A caller supplies an idempotency key. A repeated key returns the previously created journal rather than appending another entry. In this in-memory prototype the key map is process-local. Production implementations must enforce idempotency atomically in persistent storage and define key ownership and expiry rules.

## Reconciliation

The demo accepts GBP statement references and classifies each reference as matched or unmatched, while listing ledger references absent from the statement. It is reference-level matching only; amount, date, account and tolerance matching are intentionally out of scope for this first version.
