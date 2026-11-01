# Interview guide

## What trade-finance workflows are represented?
The prototype supports letters of credit, invoice financing and purchase-order financing as application types with different document requirements.

## How are documents controlled?
Each application has a required document checklist. A document is not accepted for submission until an independent reviewer marks it verified.

## How is credit risk assessed?
A deterministic and explainable heuristic uses facility size, cross-border status, party-role consistency and missing documents. It is a demonstration, not a validated credit model.

## How is separation of duties represented?
The applicant cannot act as the credit reviewer; the funding operator must differ from the applicant and approver.

## What must be built for production?
Secure identity, sanctions and KYC checks, verified documents, lender integrations, persistent storage, immutable audit logs, double-entry settlement, legal controls and regulatory review.
