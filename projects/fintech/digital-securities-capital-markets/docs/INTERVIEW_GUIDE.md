# Interview guide

## How does primary issuance work?
A verified issuer creates an instrument with a fixed total issue capacity. Only eligible investors can receive primary allocations, and allocations cannot exceed remaining units.

## How does secondary matching work?
A new limit order is compared with opposite-side open orders for the same instrument. Crossing orders match at the resting order's limit price, excluding self-trades.

## How does settlement affect ownership?
A pending matched trade is explicitly settled by an operator. The seller's simulated custody balance is debited and the buyer's is credited.

## How are corporate actions represented?
Cash distribution announcements can be processed into per-holder records using current in-memory positions. No payment is made. Stock split processing is not implemented.

## What would be required for production?
Official issuer and investor due diligence, legal instrument review, exchange and CSD/custodian integrations, DvP settlement, corporate action record-date snapshots, surveillance, durable audit, authentication, security and regulatory permissions.
