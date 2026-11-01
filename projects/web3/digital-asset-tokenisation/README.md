# Northstar Enterprise Digital Asset Tokenisation Platform

A portfolio prototype for permissioned digital asset issuance, investor allowlisting, asset registration, fixed-allocation distribution claims and a chain-event indexing API.

## Stack
- Solidity 0.8.24, Hardhat, ethers and OpenZeppelin Contracts 5
- TypeScript, Node.js, Express, Zod and Vitest
- GitHub Actions

## Smart contracts
- **PermissionedAssetToken:** ERC-20-compatible token with role-managed investor allowlisting, transfer restrictions and emergency pause.
- **AssetRegistry:** registers asset metadata references, issuer and ISO country jurisdiction; supports manager-controlled activation status.
- **DistributionManager:** funds a distribution with test-network native currency, assigns fixed allocations and permits each investor to claim once.

## Event indexer
A small HTTP service accepts validated event records, deduplicates by transaction hash/event/block and exposes a chain-filtered event list. It is an ingestion demonstration; it does not connect to an RPC node or independently verify chain logs.

## Run
Requires Node.js 22+.

    npm install
    npm run compile
    npm test
    npm run typecheck
    npm run build

## Indexer
    npm run dev

The indexer listens on port 3430. Routes: GET /health, POST /events and GET /events?chainId=31337.

## Important limitations
This repository is educational code, not an audited tokenisation product, securities register, regulated investment platform or production financial service. No legal ownership, title, beneficial interest or investor rights are created by registering metadata or minting tokens. No legal, tax, regulatory or investment advice is provided.

The contracts have not undergone independent security review. The distribution manager pays fixed allocations in native test-chain currency; it is not a dividend, interest, yield or profit-sharing engine. The indexer uses in-memory storage and accepts submitted event payloads without RPC verification, finality checks or reorganisation handling. There is no production KYC/AML, sanctions screening, identity verification, investor suitability process, custody, key management, authentication, database persistence, role governance or jurisdiction-specific compliance.

Do not deploy with real funds or market the tokens as regulated securities. Use only local development/test networks until independent legal and security reviews are complete.
