# Architecture

## Customer due diligence
Customer records are assigned a deterministic illustrative risk score using jurisdiction, business/industry keywords and customer type. High-risk profiles cannot be marked verified without an enhanced due diligence workflow; the prototype blocks that transition rather than simulating an EDD approval.

## Name screening
A tiny static synthetic watchlist returns potential matches. A separate reviewer can clear a potential match or confirm it. Confirming a match raises the customer risk band to high. This does not perform fuzzy matching or access authoritative lists.

## Transaction monitoring
Transactions are checked against transparent threshold and jurisdiction rules. Scores and triggered rule identifiers are stored with the transaction. A score threshold creates an alert with severity.

## Case management
An alert can be converted into an investigation case, assigned to an analyst, annotated, and closed with a disposition. Only assigned cases can be closed.

## Reporting
A draft report can be prepared only after a case is closed with suspicious-activity or sanctions-match disposition. A separate reviewer can mark the draft reviewed. No report is transmitted externally.

## Production evolution
Connect authoritative sanctions/PEP/adverse-media providers, identity and KYB data, beneficial ownership, calibrated transaction-monitoring models, explainability and model governance, authenticated RBAC, secure case/document storage, immutable audit, regulatory reporting integrations and jurisdiction-specific legal workflows.
