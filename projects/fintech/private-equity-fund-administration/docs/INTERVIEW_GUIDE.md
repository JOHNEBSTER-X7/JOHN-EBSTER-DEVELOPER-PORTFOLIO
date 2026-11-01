# Interview guide

## What is the difference between GP and LP?
The GP manages the fund and investment process; LPs commit capital as investors. This prototype records the roles and requires separate verification before fund setup or subscriptions.

## How are capital calls calculated?
The fund issues a call against uncalled commitments. The amount is split pro rata among accepted LP commitments, with rounding remainder assigned to the final allocation.

## How is NAV calculated?
The prototype adds fair values from the fund's investment register. It also reports investment cost and unrealised gain. A production NAV requires liabilities, fees, expenses, FX, accruals and valuation governance.

## How is carried interest represented?
A simplified hurdle amount is estimated from paid capital calls and the configured hurdle rate. Carry is calculated on positive profit above that amount and allocated pro rata. It is not a full legal waterfall.

## What needs to change before production?
Persistent double-entry accounting, authenticated investor access, full KYC/AML, legal subscription documents, bank and custodian integrations, independent valuations, complete waterfall logic, tax treatment, audit retention and regulatory permissions.
