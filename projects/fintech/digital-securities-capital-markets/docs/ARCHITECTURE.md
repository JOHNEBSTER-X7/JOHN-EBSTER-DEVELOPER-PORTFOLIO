# Architecture

## Issuer and investor registers
Issuer verification and investor eligibility are separate review steps. Securities cannot be issued until the issuer is verified. Primary allocation requires an eligible investor.

## Instrument register
Equity and bond records include an ISIN-shaped identifier, currency, nominal value, issue price and total units. Bond records also require a maturity date and coupon basis points.

## Primary market
An allocation increases issued units and creates/updates a custody holding. The issue capacity cannot be exceeded.

## Secondary market
Limit orders are matched against eligible opposite-side orders for the same instrument when prices cross. The simulation excludes self-trades and uses the resting order price. Matched trades await an explicit settlement operation.

## Custody and settlement
The settlement operation debits the seller's simulated units and credits the buyer. A missing seller balance marks the trade failed. This is not delivery-versus-payment and has no cash leg.

## Corporate actions
Cash distribution processing snapshots current in-memory holdings and records a per-investor amount. It does not move money. Stock splits can be announced but not processed.

## Production evolution
Add authenticated role-based access, durable event-sourced records, official ISIN/issuer verification, complete market rulebooks, pre-trade risk, market surveillance, cash-leg and DvP settlement, corporate action record-date snapshots, reconciliation, external custodian/CSD integrations, security hardening and regulatory approvals.
