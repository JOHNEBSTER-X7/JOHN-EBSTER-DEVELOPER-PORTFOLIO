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
**Status:** Prototype published; TypeScript check, 12 tests and production build passed in GitHub Actions. Live search requires a Tavily API key; without it, only uploaded documents are searched. Relevance scores are not credibility ratings.

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
\n\n### Northstar Cloud Infrastructure & DevOps Platform\n**Path:** [projects/devops/cloud-infrastructure-platform](./projects/devops/cloud-infrastructure-platform/)  \n**Stack:** TypeScript, Express, Docker, Docker Compose, Kubernetes manifests, GitHub Actions  \n**Goal:** Demonstrate service catalogue, release readiness checks, approval-controlled deployments, operational events, containerisation and Kubernetes deployment configuration.  \n**Status:** Initial implementation published; CI verification pending. Deployment execution is simulated; no cloud account or cluster is changed.\n