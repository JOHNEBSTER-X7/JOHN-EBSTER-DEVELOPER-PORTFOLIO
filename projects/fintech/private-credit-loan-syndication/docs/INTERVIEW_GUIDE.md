# Interview guide

## How is a syndicated facility activated?
The facility begins in syndicating status. Verified lenders allocate participation commitments. It becomes active when allocations equal the facility commitment.

## How does the repayment schedule work?
The prototype generates equal principal instalments over the agreed term. Monthly interest is estimated from opening principal and annual basis points divided by twelve.

## How are repayments allocated?
Payments are applied to the earliest unpaid instalment, covering outstanding interest before principal. The outstanding principal is reduced by the principal component.

## What does covenant monitoring do?
It compares a supplied leverage or interest-coverage observation against a configured maximum or minimum threshold and records compliant or breached status.

## What is required for production?
Persistent loan accounting, authenticated access, contractual schedules and day-count conventions, actual lender funding, payment and bank integrations, verified collateral, arrears/default management, covenant evidence and regulatory controls.