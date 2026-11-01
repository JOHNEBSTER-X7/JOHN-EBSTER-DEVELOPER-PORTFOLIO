# Architecture

## Matching engine

Orders are stored with sequence numbers. When a new order arrives, eligible opposite-side limit orders are sorted by best price and then insertion sequence. Each execution occurs at the resting order's price. Both orders are updated for filled and remaining quantities; trade records identify buyer, seller, price and quantity.

## API layer

Express routes validate request bodies with Zod and delegate to the exchange domain service. The API exposes order submission, cancellation, balances, market metadata, order book depth and trade history.

## Current state model

All state is held in process memory. Wallet balances are seeded through a demo funding endpoint. This makes the application straightforward to test but unsuitable for production or multi-instance operation.

## Production evolution

Implement atomic reservation of funds at order acceptance, database transactions and row-level locking, idempotent command processing, append-only event sourcing, deterministic recovery, decimal-safe fixed-point arithmetic, authentication and authorization, market surveillance, settlement adapters and operational observability.
