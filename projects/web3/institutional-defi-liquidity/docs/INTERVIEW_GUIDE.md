# Interview guide

## Explain the AMM formula

The pool uses a constant-product curve. Input is reduced by the 0.30% fee before computing output, so the invariant and reserves reflect the trade and retained fee. A minimum-output parameter provides caller-defined slippage protection.

## What does an LP share represent?

It is a proportional claim on the pool's two reserves. Initial shares use the square root of the product of deposits; later deposits mint shares proportionally to existing reserves and total supply.

## How does lending health work?

Collateral and debt are valued using an oracle interface. The vault allows debt up to 60% of collateral value. A position becomes liquidatable when debt exceeds that threshold. The mock oracle makes this behaviour deterministic in tests.

## What would you add before production?

- Oracle freshness and manipulation protection.
- Fuzzing, invariant testing, formal verification and independent audit.
- Interest accrual, close factors, liquidation auctions and bad-debt management.
- Multi-pool routing, token decimal handling and broader ERC-20 compatibility.
- Durable event indexing with RPC verification and reorg recovery.
- Governance timelocks, multisig administration, monitoring and incident response.

## Scope honesty

This is a local/test-network learning prototype. It is not an audited DeFi protocol, does not provide investment returns and should not hold real funds.
