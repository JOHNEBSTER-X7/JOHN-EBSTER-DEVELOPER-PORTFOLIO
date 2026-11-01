# Northstar Institutional DeFi & Liquidity Protocol

A portfolio-grade educational DeFi prototype demonstrating constant-product liquidity pools, swaps, LP shares, collateralised borrowing, oracle-driven health checks, liquidation, and a chain-event ingestion API.

## Stack
Solidity 0.8.24, OpenZeppelin Contracts 5, Hardhat, ethers, TypeScript, Express, Zod, Vitest and Supertest.

## Smart contracts

- **ConstantProductPool:** two-token AMM, 0.30% swap fee, reserve accounting, proportional liquidity shares, add/remove liquidity, quote and exact-input swap with minimum-output slippage protection.
- **CollateralLendingVault:** collateral deposits, LTV-constrained borrowing, repayment, health checks and liquidation with a 5% bonus.
- **MockPriceOracle:** owner-controlled USD price feed for local testing only.
- **MockERC20:** unrestricted test token faucet for tests and local demos.

## Event indexer
Validated Swap, LiquidityAdded, LiquidityRemoved, Borrowed, Repaid and Liquidated event ingestion, duplicate detection and chain filtering. It accepts submitted event payloads; it does not independently fetch or verify RPC logs.

## Run locally

Requires Node.js 22+.

    npm install
    npm run compile
    npm test
    npm run typecheck
    npm run build

Indexer:

    npm run dev

Listens on port 3440. Routes: GET /health, POST /events, GET /events?chainId=31337.

## Scope and important limitations

This is educational software and has not been independently audited. Do not deploy with real assets or funds.

The AMM is a minimal constant-product demonstration. It does not implement TWAP/oracle protections, flash-loan defence, protocol fee extraction, dynamic fees, pool factory, multi-hop routing, token decimal normalisation or protection against all token behaviours (including fee-on-transfer/rebasing tokens).

The lending vault assumes both assets use 18 decimals, has no interest accrual, reserve accounting, bad-debt waterfall, liquidation auction, partial collateral selection or oracle freshness/staleness checks. The mock oracle is centrally controlled and must never be treated as a production price feed. Liquidation economics are simplified.

The indexer is in-memory and accepts submitted event payloads without on-chain verification, finality tracking or chain reorganisation recovery. No authentication, durable database, monitoring, keeper network, governance timelock, production risk engine, legal/regulatory review or security audit is provided. No yield or investment return is promised or calculated.
