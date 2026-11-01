# Portfolio project index

This index distinguishes working software from planned work. Status labels are deliberately conservative.

## Web3 and smart contracts

### Three-of-Five Multisignature Wallet
**Path:** [projects/web3/three-of-five-multisig](./projects/web3/three-of-five-multisig/)  
**Stack:** Solidity, Hardhat, JavaScript  
**Goal:** Demonstrate owner management, proposal submission, confirmation/revocation and threshold-based execution for a fixed five-owner wallet.  
**Status:** Educational prototype. GitHub Actions compile and test workflow passed. It has not been security-audited and must not hold production funds.

## Python and backend engineering

### Market Intelligence API
**Path:** [projects/python/market-intelligence-api](./projects/python/market-intelligence-api/)  
**Stack:** Python, FastAPI, Pydantic, pytest  
**Goal:** Provide a small REST API for browsing and scoring illustrative market signals.  
**Status:** Prototype; 7 tests passed in GitHub Actions. Included sample signals are synthetic; heuristic scores are not validated investment or forecasting outputs.

## Full-stack applications

### Northstar CRM — Enterprise Contact & Sales Workspace
**Path:** [projects/full-stack/enterprise-crm](./projects/full-stack/enterprise-crm/)  
**Stack:** Next.js, React, TypeScript, PostgreSQL, Prisma, Zod  
**Goal:** Demonstrate contact creation, search, filtering, status management, REST API design and relational persistence.  
**Status:** Initial implementation published. GitHub Actions type-check workflow is configured; successful CI status and database-backed runtime are not yet verified.

## AI engineering

Planned project area. Candidate work includes document Q&A/RAG, an AI support assistant and a research workflow with source attribution.

## Cloud and DevOps

Planned project area. Candidate work includes containerised services, CI pipelines and serverless processing.

## FinTech and data

Planned project area. Candidate work includes portfolio analytics, transaction reconciliation and a backtesting research framework.

---

## Status vocabulary

- **Planned:** not yet implemented.
- **Prototype:** an early implementation for learning or demonstration.
- **Tested:** the documented test command has been run successfully in the stated environment.
- **Deployed:** a reachable deployment exists and the link has been checked.
- **Audited:** an independent, identifiable audit report exists.

A project only advances to a stronger status when evidence is available.
