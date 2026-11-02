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
**Status:** Prototype published; 13 automated tests, TypeScript check and build passed in GitHub Actions. Uses synthetic balances and illustrative static FX rates; not connected to banks or live markets.


### Northstar Institutional Trade Finance & Supply Chain Finance Platform
**Path:** [projects/fintech/trade-finance-supply-chain-platform](./projects/fintech/trade-finance-supply-chain-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate importer/exporter onboarding, trade-document verification, letters of credit, invoice and purchase-order finance workflows, explainable risk scoring, lender facility checks, maker-checker approvals, simulated funding and settlement, and audit events.  
**Status:** Prototype published; 13 automated tests, TypeScript check and build passed in GitHub Actions. Funding and settlement are simulated; no live lender or bank integrations.


### Northstar Institutional Banking-as-a-Service & Open Banking Platform
**Path:** [projects/fintech/open-banking-baas-platform](./projects/fintech/open-banking-baas-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate consent-bound account aggregation, transaction access, payment initiation, idempotency, balance reservation, transaction categorisation, fraud-alert review, reconciliation and audit events.  
**Status:** Prototype published; 16 automated tests, TypeScript check and build passed in GitHub Actions. All accounts and payments are synthetic; no live bank or payment integrations.


### Northstar Institutional Fraud Detection, AML & Financial Crime Compliance Platform
**Path:** [projects/fintech/financial-crime-aml-platform](./projects/fintech/financial-crime-aml-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate KYC/KYB onboarding, synthetic sanctions/PEP screening, transaction-monitoring rules, explainable risk scoring, alert investigation, case management, report drafting and audit events.  
**Status:** Prototype published; 19 automated tests, TypeScript check and build passed in GitHub Actions. Watchlists and transactions are synthetic; no regulatory reporting or live screening integrations.


### Northstar Institutional Digital Securities & Capital Markets Platform
**Path:** [projects/fintech/digital-securities-capital-markets](./projects/fintech/digital-securities-capital-markets/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate issuer and investor eligibility, equity/bond instrument registration, primary allocations, secondary limit-order matching, simulated settlement, custody holdings, cash distribution records and audit events.  
**Status:** Prototype published; 18 automated tests, TypeScript check and build passed in GitHub Actions. All securities and transactions are synthetic; no regulated market or custody integration.


### Northstar Institutional Private Equity, Venture Capital & Fund Administration Platform
**Path:** [projects/fintech/private-equity-fund-administration](./projects/fintech/private-equity-fund-administration/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate GP/LP onboarding, fund and SPV setup, subscriptions, commitments, capital calls, portfolio valuations, NAV, simplified distributions and carried-interest calculations, investor statements and audit history.  
**Status:** Prototype published; 19 automated tests, TypeScript check and build passed in GitHub Actions. All records are synthetic; no bank, custodian, legal or regulatory integrations.


### Northstar Institutional Private Credit, Lending & Loan Syndication Platform
**Path:** [projects/fintech/private-credit-loan-syndication](./projects/fintech/private-credit-loan-syndication/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate borrower/lender onboarding, credit applications, facility syndication, drawdowns, repayment schedules, collateral registers and covenant monitoring.  
**Status:** Prototype published; 8 automated tests, TypeScript check and build passed in GitHub Actions. All records and operations are simulated; no real lending, bank or payment integrations.


### Northstar Institutional Payments, Cross-Border Settlement & Treasury Infrastructure
**Path:** [projects/fintech/cross-border-payments-settlement-platform](./projects/fintech/cross-border-payments-settlement-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate multi-currency payment initiation, FX quote acceptance, idempotency, correspondent routing, synthetic screening, maker-checker approval, liquidity reservation, dispatch, simulated settlement/returns, ISO 20022-style and SWIFT-style message generation, treasury dashboards and statement reconciliation.  
**Status:** Prototype published; 18 automated tests, TypeScript check and build passed in GitHub Actions. All accounts and transaction data are synthetic; no live bank, SWIFT, sanctions, FX or payment-scheme integrations.


### Northstar Institutional Fraud Detection, Transaction Monitoring & Payment Intelligence
**Path:** [projects/fintech/fraud-transaction-monitoring-intelligence](./projects/fintech/fraud-transaction-monitoring-intelligence/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate explainable 0–100 transaction risk scoring, velocity and behavioural rules, geographic/device indicators, shared-counterparty network analysis, alert creation, investigator assignment, notes, escalation, case disposition and monitoring dashboards.  
**Status:** Prototype published; 25 automated tests, TypeScript check and build passed in GitHub Actions. All data and signals are synthetic; no trained ML model, live watchlists or production fraud decisions.


### Northstar Institutional Banking Operations Command Centre
**Path:** [projects/fintech/banking-operations-command-centre](./projects/fintech/banking-operations-command-centre/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest, responsive HTML/CSS/JavaScript dashboard  
**Goal:** Consolidate synthetic payments, treasury liquidity, fraud/AML alerts, reconciliation exceptions and operational work queues into one management view, with alert actions, task ownership, audit events and a documented integration roadmap.  
**Status:** Prototype published; 23 automated tests, TypeScript check and build passed in GitHub Actions. It is a standalone fixture-backed dashboard; independent portfolio systems are not connected.


### Northstar Banking Integration Gateway & Event Bus
Path: `projects/fintech/banking-integration-gateway/`  
Stack: TypeScript, Express, Zod, Vitest and Supertest.  
Scope: Authenticated domain event ingestion, versioned contracts, idempotency, simulated routing, retry/dead-letter handling and audit records.  
Status: Prototype published; 18 automated tests, TypeScript check and build passed in GitHub Actions. No external services are connected.


### Northstar Institutional Event Streaming & Banking Data Platform
Path: `projects/fintech/banking-event-streaming-platform/`  
Stack: TypeScript, Node.js, Express, Zod, append-only JSONL persistence, Vitest and Supertest.  
Scope: Versioned event schemas, persistent event offsets, consumer groups, sequential acknowledgements, replay, failure tracking and dead-letter monitoring.  
Status: Prototype published; 23 automated tests, TypeScript check and build passed in GitHub Actions. Local single-node persistence; not a distributed message broker.

### Northstar Institutional Banking Data Warehouse & Regulatory Reporting
**Path:** [projects/fintech/banking-data-warehouse-regulatory-reporting](./projects/fintech/banking-data-warehouse-regulatory-reporting/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Consolidate canonical banking records into executive, payments, treasury, fraud/AML, reconciliation and operational reports, with data-quality checks, source lineage, audit and CSV/JSON exports.  
**Status:** Prototype published; 17 automated tests, TypeScript check and production build passed in GitHub Actions. Synthetic fixtures only; no live integrations, durable warehouse, official regulatory returns or production access controls.

### Northstar Institutional Banking Data Governance, Metadata & Data Quality
**Path:** [projects/fintech/banking-data-governance-platform](./projects/fintech/banking-data-governance-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest  
**Goal:** Govern banking dataset metadata, ownership, stewards, versioned schemas, quality rules, validation findings, remediation issues, lineage and audit.  
**Status:** Prototype published; 12 automated tests, TypeScript check and production build passed in GitHub Actions. In-memory state; no live integrations, access enforcement or regulatory certification.


### Northstar Institutional Banking Data Security & Privacy Management
**Path:** [projects/fintech/banking-data-security-privacy-platform](./projects/fintech/banking-data-security-privacy-platform/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate role-, dataset-, action- and purpose-scoped access policies, consent records, retention and legal-hold checks, sensitive-field masking, privacy request workflows, access approvals, security incident response and audit events.  
**Status:** Prototype published; 18 automated tests, TypeScript check and production build passed in GitHub Actions. In-memory demonstration only; no authentication, real infrastructure enforcement, cryptographic protection, automatic erasure or regulatory certification.


### Northstar Institutional Banking Identity & Access Management
**Path:** [projects/fintech/banking-identity-access-management](./projects/fintech/banking-identity-access-management/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate user lifecycle, scrypt password hashing, expiring/revocable sessions, role permissions, resource-scoped policies, maker-checker role approvals, scoped API keys and audit events.  
**Status:** Prototype published; 21 automated tests, TypeScript check and production build passed in GitHub Actions. In-memory demo; MFA is an enforcement flag only and administrative routes are not protected by authentication middleware.
 
## Financial technology

### Northstar Institutional Banking Security Operations & Threat Intelligence
**Path:** [projects/fintech/banking-security-operations-threat-intelligence](./projects/fintech/banking-security-operations-threat-intelligence/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate security-event ingestion, explainable detections, threat-indicator matching, incident workflows, vulnerability tracking, dry-run response playbooks and audit reporting.  
**Status:** Prototype; 14 CI tests passed, TypeScript check and build passed in [GitHub Actions](https://github.com/JOHNEBSTER-X7/JOHN-EBSTER-DEVELOPER-PORTFOLIO/actions/runs/41405679328). Uses in-memory state and synthetic/manual inputs; no live SIEM, threat-feed, EDR or SOAR integrations. Response actions are simulations only.

### Northstar Institutional Banking Network Security & Zero Trust Architecture
**Path:** [projects/fintech/banking-zero-trust-network-security](./projects/fintech/banking-zero-trust-network-security/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate device trust assessments, SPIFFE-style workload identities, network segmentation policies, default-deny flow evaluation, and audit reporting.  
**Status:** Prototype; 15 tests passed, TypeScript check and build passed in [GitHub Actions](https://github.com/JOHNEBSTER-X7/JOHN-EBSTER-DEVELOPER-PORTFOLIO/actions/runs/41406093641). All enforcement is simulated; no real network controls or device attestation are connected.

### Northstar Institutional Banking Security Compliance, GRC & Regulatory Controls
**Path:** [projects/fintech/banking-security-compliance-grc](./projects/fintech/banking-security-compliance-grc/)  
**Stack:** TypeScript, Node.js, Express, Zod, Vitest, Supertest  
**Goal:** Demonstrate banking security control libraries, risk scoring, evidence review, audit planning, findings remediation and framework coverage reporting.  
**Status:** Prototype published; CI verification pending. Framework mappings are illustrative and do not establish compliance or certification.
