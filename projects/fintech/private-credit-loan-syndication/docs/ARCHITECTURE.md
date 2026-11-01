# Architecture

## Origination and underwriting
Borrower and lender parties are registered separately. Verification is a reviewer-controlled status. Borrowers submit credit applications and an independent reviewer approves or rejects them. An approved application can create one facility.

## Syndication
The facility has a fixed commitment. Verified lenders allocate participations. The facility activates only when allocated commitments equal the facility limit. This is a record-only simulation; no lender funds move.

## Drawdown and servicing
Drawdowns create a loan and monthly equal-principal schedule. Interest is approximated monthly from opening principal and annual basis points divided by twelve. Payments are allocated to earliest outstanding instalments, interest first, then principal.

## Collateral and covenants
Collateral records include asset type, description and manual valuation. Covenant observations are entered manually and compared against maximum leverage or minimum interest-coverage thresholds.

## Production evolution
Add persistent loan accounting, exact contractual day-count calculations, lender funding settlement, payment rails, arrears/default/recovery workflows, collateral perfection checks, evidence-backed covenant testing, authenticated access, audit retention and regulatory controls.