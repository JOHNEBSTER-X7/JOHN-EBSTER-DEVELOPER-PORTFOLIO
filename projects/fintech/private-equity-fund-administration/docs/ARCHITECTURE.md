# Architecture

## Participants and governance
GP and LP records have a verification flag. Fund creation requires a verified GP; subscriptions require a verified LP. Review actions require a separate reviewer identity.

## Fund formation and subscriptions
Fund records include vehicle, currency, target, management fee, carried interest and hurdle rates in basis points. Accepted subscriptions update committed capital. Activation requires accepted commitments.

## Capital calls
Calls cannot exceed uncalled commitments. The call amount is allocated pro rata across accepted LP commitments using integer minor units. The final LP allocation absorbs rounding remainder. Payments are recorded against the individual allocation and update call status.

## Portfolio and NAV
Investments are held in a fund register with cost and fair value. NAV is currently the sum of investment fair values. Unrealised gain is fair value less cost.

## Distributions and carry
The distribution engine allocates gross proceeds pro rata by accepted commitment. It estimates return of capital using recorded paid calls and prior return-of-capital distributions. Carry is applied to positive profit above a simple hurdle amount. It is an illustrative simplified waterfall, not a legal or accounting calculation.

## Production evolution
Use durable relational storage, double-entry fund accounting, valuation policy and approvals, cash and bank reconciliation, full legal-document lifecycle, investor portal access controls, tax and fee accruals, configurable fund waterfalls, clawback and escrow logic, audit retention and jurisdiction-specific regulatory reporting.
