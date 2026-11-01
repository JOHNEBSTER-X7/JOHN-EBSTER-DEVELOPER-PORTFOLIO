# Interview guide

## 60-second explanation

“I built a TypeScript transaction-monitoring service that ingests synthetic payment events, applies explainable rules, calculates a 0–100 risk score, creates investigation cases and supports analyst assignment, notes, escalation and disposition. The rules include transaction velocity, large values, geographic inconsistencies, device changes, high-risk destination indicators and shared counterparties. I also exposed dashboard metrics and an audit trail through a validated REST API. It is a transparent rule-based portfolio simulation, not a trained fraud model or a production AML system.”

## Questions to prepare

1. Why did you choose an explainable rules engine for this prototype?
2. How do you avoid duplicate processing of a transaction reference?
3. How would you calculate velocity efficiently at high throughput?
4. How would you handle late-arriving and out-of-order events?
5. How would you reduce false positives and tune alert thresholds?
6. What is the difference between fraud detection, AML transaction monitoring and sanctions screening?
7. Why is a shared counterparty signal not proof of a fraud ring?
8. How would you introduce graph analytics without over-interpreting connections?
9. How would you measure precision, recall and investigator workload?
10. What controls are needed for data privacy, model governance and human oversight?

## Limitations to state honestly

The engine is rule-based, uses synthetic inputs and stores state in memory. It has no trained ML model, authentication, durable event streaming, real watchlists, trusted device intelligence, production-grade graph analytics, bank integration or regulatory reporting. Scores are indicators for demonstration only.
