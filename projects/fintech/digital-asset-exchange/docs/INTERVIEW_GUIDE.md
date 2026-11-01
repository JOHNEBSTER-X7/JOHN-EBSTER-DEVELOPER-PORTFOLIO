# Interview guide

## How is price-time priority implemented?
Opposing limit orders are sorted by the best executable price. Ties are resolved by the monotonically increasing sequence assigned when each order enters the book.

## What is the execution price?
The resting maker order's limit price. This is demonstrated in the crossing-limit-order test.

## How are partial fills handled?
The engine reduces remaining quantity and increases filled quantity on both sides. An order with some but not all quantity executed remains partially filled.

## What is missing before production?
Funds reservation, transactional persistence, concurrency controls, idempotency, durable event sourcing, decimal-safe arithmetic, authentication, surveillance, settlement, reconciliation and independent security review.

## Why are balances simulated?
The project is focused on matching-engine fundamentals and should not be mistaken for a custody or payment system. The funding endpoint is deliberately a demo faucet.
