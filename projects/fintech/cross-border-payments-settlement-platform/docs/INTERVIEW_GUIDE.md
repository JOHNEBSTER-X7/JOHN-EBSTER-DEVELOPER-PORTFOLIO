# Interview guide

## Explain the system in 60 seconds

“I built a TypeScript payment orchestration prototype that models multi-currency payment initiation, FX quote acceptance, screening, maker-checker approval, liquidity reservation, dispatch, settlement and reconciliation. I used integer minor units for money, BigInt arithmetic for FX conversion, idempotency keys to reduce duplicate initiation risk, and explicit lifecycle states to prevent invalid transitions. The API also renders illustrative ISO 20022-style and SWIFT-style messages. It is an in-memory simulation, not connected to banks or payment networks.”

## Topics to prepare

1. Why are monetary amounts stored as integer minor units?
2. Why is an FX rate stored as a scaled integer?
3. How does idempotency protect payment initiation, and what happens when the same key has a different payload?
4. Why reserve funds at approval rather than only at settlement?
5. How would concurrent payment requests create a race condition in the current in-memory implementation?
6. What is the difference between a payment message network and settlement finality?
7. What is the difference between ISO 20022 and SWIFT?
8. How would you implement a durable outbox and retry-safe network adapter?
9. How would you design a nostro/vostro ledger and correspondent bank reconciliation?
10. How would you replace synthetic screening with a governed sanctions/PEP provider and case workflow?

## Honest limitations to volunteer

The implementation uses in-memory state, seeded accounts and simplified two-decimal currency handling. It lacks authentication, production authorisation, durable accounting, concurrency controls, live FX, bank connectivity, real sanctions data and scheme certification. The sample messages are illustrative, not validated network messages. Explain what would need to change before any production deployment.
