# Interview guide

## 60-second explanation

“I built a responsive institutional banking operations command centre with a TypeScript and Express API. It consolidates synthetic payment status, treasury liquidity, fraud and AML alerts, reconciliation exceptions and operational work queues into one dashboard. Operators can acknowledge, investigate, escalate and resolve alerts, as well as update operational tasks. I separated the domain views from the aggregation layer and documented how to replace fixtures with secure APIs and event-driven integrations. The current implementation is a standalone simulation, not a live integration platform.”

## Interview topics

1. Why should a command centre not become a second system of record?
2. How would you define versioned domain API contracts?
3. How would you handle stale data and partial domain outages?
4. What is the difference between event streaming and polling?
5. How would you design idempotent event consumers?
6. How would you implement RBAC, SSO and maker-checker controls?
7. How would you preserve auditability and data lineage?
8. How should liquidity metrics be reconciled with the general ledger?
9. How would you prevent a fraud alert from being mistaken for a confirmed fraud outcome?
10. How would you measure operational dashboard usefulness?

## Limitations to state honestly

All domain data is seeded synthetic data. The independent portfolio projects are not connected. There is no authentication, persistent storage, broker, live banking integration, authoritative ledger or production audit system. The command centre demonstrates a dashboard and target integration architecture, not a deployed institutional control plane.
