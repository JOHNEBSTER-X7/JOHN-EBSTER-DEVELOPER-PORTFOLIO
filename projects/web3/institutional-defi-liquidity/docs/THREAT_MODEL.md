# Threat model and production review

| Risk | Demo control | Additional production work |
|---|---|---|
| Re-entrant token callbacks | ReentrancyGuard on pool and vault entry points | Independent audit and adversarial token tests |
| Slippage and price impact | Minimum output on swaps | TWAP/oracle checks, deadlines, routing controls |
| Liquidity imbalance | Proportional LP share calculations | Fuzzing, invariant testing, token compatibility policy |
| Oracle manipulation/staleness | Mock feed isolated to local tests | Decentralised feed, heartbeat, deviation and circuit-breaker controls |
| Undercollateralised borrowing | LTV health check and liquidation | Interest, liquidation close factor, auctions, bad-debt handling |
| Privileged price manipulation | Mock oracle owner | Governance, timelocks, independent oracle risk controls |
| Fake event ingestion | Schema validation and dedupe | RPC verification, ABI decoding, finality and reorg handling |

Do not use this prototype with real funds. It has not undergone independent smart-contract security review.
