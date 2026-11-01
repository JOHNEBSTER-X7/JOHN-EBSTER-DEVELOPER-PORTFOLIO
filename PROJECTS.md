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

## AI engineering

### Northstar Document Intelligence — RAG
**Path:** [projects/ai/document-intelligence-rag](./projects/ai/document-intelligence-rag/)  
**Stack:** Python, FastAPI, SQLite, pypdf, pytest, Docker  
**Goal:** Ingest PDF/TXT/Markdown files, chunk and index their text, retrieve relevant passages and return document/page/chunk citations.  
**Status:** Retrieval-first prototype; 9 tests passed in GitHub Actions. Uses lexical token overlap, not embeddings or LLM-generated answers. No authentication or production data safeguards are implemented.

### Northstar AI Customer Support Agent
**Path:** [projects/ai/customer-support-agent](./projects/ai/customer-support-agent/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest  
**Goal:** Provide browser chat, knowledge-base retrieval, conversation history, optional context-grounded LLM responses and a human-support escalation workflow.  
**Status:** Prototype published; TypeScript check, 9 tests and production build passed in GitHub Actions. Conversation storage and escalation are in-memory/demo-only; no external ticket is sent.

## Full-stack applications

### Northstar CRM — Enterprise Contact & Sales Workspace
**Path:** [projects/full-stack/enterprise-crm](./projects/full-stack/enterprise-crm/)  
**Stack:** Next.js, React, TypeScript, PostgreSQL, Prisma, Zod  
**Goal:** Demonstrate contact creation, search, filtering, status management, REST API design and relational persistence.  
**Status:** Initial implementation published; GitHub Actions type-check workflow passed. Database-backed runtime and deployment are not verified. Demo only: no authentication or tenant isolation.

### Northstar Multi-Agent Business Automation
**Path:** [projects/ai/multi-agent-business-automation](./projects/ai/multi-agent-business-automation/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest  
**Goal:** Coordinate research, business analysis, writing and quality-review agents through a typed workflow with a human approval gate.  
**Status:** Prototype published; TypeScript check, 10 tests and production build passed in GitHub Actions. Agent execution is deterministic and uses the supplied brief only; workflow state is in-memory and no external action is executed.

### Northstar Enterprise Research & Intelligence
**Path:** [projects/ai/enterprise-research-intelligence](./projects/ai/enterprise-research-intelligence/)  
**Stack:** TypeScript, Node.js, Express, Tavily API adapter, PDF extraction, lexical retrieval, Vitest  
**Goal:** Combine optional live web search with uploaded documents, evidence retrieval, source registers, research reports and Markdown export.  
**Status:** Prototype published; TypeScript check, 13 tests and production build passed in GitHub Actions. Includes Prometheus metrics exposition and scrape configuration. Live search requires a Tavily API key; without it, only uploaded documents are searched. Relevance scores are not credibility ratings.

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


### Northstar Enterprise Business Operations Platform
**Path:** [projects/full-stack/business-operations-platform](./projects/full-stack/business-operations-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest  
**Goal:** CRM, workflow templates, task assignment, human approval gates, activity feed and operational dashboard.  
**Status:** Prototype published; TypeScript check, 13 tests and production build passed in GitHub Actions. Workflow recommendations are deterministic templates; no external business actions are executed.


### Northstar Cloud Infrastructure & DevOps Platform
**Path:** [projects/devops/cloud-infrastructure-platform](./projects/devops/cloud-infrastructure-platform/)  
**Stack:** TypeScript, Express, Docker, Docker Compose, Kubernetes, Terraform, AWS ECS Fargate, ECR, ALB, CloudWatch, GitHub Actions OIDC  
**Goal:** Demonstrate service catalogue, release readiness checks, approval-controlled deployments, operational events, containerisation and Kubernetes deployment configuration.  
**Status:** Prototype published; TypeScript check, 13 tests, production build and AWS Terraform validation passed in GitHub Actions. AWS infrastructure and gated deployment workflow are prepared; no live AWS deployment has been activated.


### Northstar FinTech Ledger & Reconciliation Platform
**Path:** [projects/fintech/ledger-reconciliation-platform](./projects/fintech/ledger-reconciliation-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate double-entry journal posting, account balances, idempotency, currency validation, and statement-reference reconciliation.  
**Status:** Prototype published; 11 automated tests, TypeScript check and production build passed in GitHub Actions. In-memory only; does not process real payments or hold funds.


### Northstar Enterprise Banking & Payments API
**Path:** [projects/fintech/banking-payments-api](./projects/fintech/banking-payments-api/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate customer and merchant onboarding, simulated KYC review, payment lifecycle, idempotency, risk scoring, refunds, chargeback disputes and compliance alert handling.  
**Status:** Prototype published; 12 automated tests, TypeScript check and production build passed in GitHub Actions. All money movement and identity review are simulated; no real payment processing or KYC verification is connected.


### Northstar Enterprise Digital Asset Tokenisation Platform
**Path:** [projects/web3/digital-asset-tokenisation](./projects/web3/digital-asset-tokenisation/)  
**Stack:** Solidity 0.8.24, OpenZeppelin, Hardhat, ethers, TypeScript, Express, Vitest  
**Goal:** Demonstrate permissioned token issuance, investor allowlisting, asset metadata registration, fixed-allocation distribution claims and chain-event ingestion.  
**Status:** Prototype published; 8 smart-contract tests, 4 indexer tests, TypeScript check, Solidity compilation and TypeScript build passed in GitHub Actions. No legal ownership, live securities offering, real KYC, custody or production RPC indexing is provided.


### Northstar Institutional DeFi & Liquidity Protocol
**Path:** [projects/web3/institutional-defi-liquidity](./projects/web3/institutional-defi-liquidity/)  
**Stack:** Solidity 0.8.24, OpenZeppelin, Hardhat, ethers, TypeScript, Express, Vitest  
**Goal:** Demonstrate a constant-product AMM, LP shares, fee-bearing swaps, collateralised borrowing, oracle-based health checks, liquidation and chain-event ingestion.  
**Status:** Prototype published; 10 smart-contract tests, 4 indexer tests, Solidity compilation, TypeScript check and build passed in GitHub Actions. Not audited and not suitable for real funds.


### Northstar Institutional Digital Asset Exchange
**Path:** [projects/fintech/digital-asset-exchange](./projects/fintech/digital-asset-exchange/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate a price-time-priority limit order book, market and limit orders, partial fills, cancellation, simulated balances, market depth and trade history.  
**Status:** Prototype published; 10 automated tests, TypeScript check and build passed in GitHub Actions. Balances and matching are in-memory simulations, not a live exchange or custody service.


### Northstar Institutional Treasury & Risk Management Platform
**Path:** [projects/fintech/treasury-risk-platform](./projects/fintech/treasury-risk-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate multi-currency treasury positions, dated liquidity forecasts, GBP FX exposure, scenario stress tests, counterparty limits and maker-checker transaction approvals.  
**Status:** Portfolio prototype published; CI verification pending. Uses synthetic balances and illustrative static FX rates; not connected to banks or live markets.
