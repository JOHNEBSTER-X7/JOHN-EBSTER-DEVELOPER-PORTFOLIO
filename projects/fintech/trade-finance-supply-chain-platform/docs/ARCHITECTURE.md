# Architecture

## Party onboarding
Trade participants are registered with a declared role and country. A separate reviewer changes a pending party to verified or rejected. The sample reviewer check is a workflow demonstration, not identity assurance.

## Application lifecycle
A verified importer/exporter pair creates a finance request. The application type determines required documents. Documents are registered by reference and independently marked verified. Submission is blocked until all required documents are verified.

## Risk and credit
The rules engine generates a transparent score from facility size, cross-border status, role consistency and document completeness. High-risk cases are blocked from automatic approval and require further due diligence. The demonstration lender has a fixed GBP facility and only supports matching GBP requests.

## Maker-checker workflow
A reviewer distinct from the applicant approves or rejects a submitted application. A separate operator funds an approved application. Settlement requires a funded application and a settlement reference. Funding and settlement only change simulated application state; no money moves.

## Audit
Lifecycle actions append structured events to an in-memory audit list. Production requires durable, immutable, access-controlled audit storage.

## Production evolution
Add authenticated identities, entitlements, real KYC/AML and sanctions screening, secure document storage and malware scanning, document authenticity controls, lender APIs, persistent transactions, idempotency, double-entry settlement ledger, legal document templates and jurisdiction-specific trade-finance compliance.
