# Rules and model governance

## Illustrative signal catalogue

| Signal | Points | Trigger |
|---|---:|---|
| High transaction velocity | 25 | Four or more earlier customer transactions in the preceding hour |
| Large transaction value | 18 | Amount at or above 500,000 minor units |
| High-risk destination indicator | 35 | Destination matches synthetic country list (IR, KP, SY) |
| Geographic inconsistency | 18 | IP country differs from counterparty country |
| New device | 12 | Device differs from recent customer activity |
| Shared counterparty network | 20 | Counterparty has activity from at least two other customers |
| Round-value transfer | 5 | Amount is an exact multiple of 100,000 minor units |
| Repeated outgoing payments | 15 | At least three earlier debits in the preceding hour |

The score is capped at 100. Bands are 0–34 low, 35–59 medium, 60–79 high and 80–100 critical. An alert/case is created at 35.

## Governance principles for a real institution

1. Define the intended use and prohibited uses before selecting rules or models.
2. Establish lawful basis, purpose limitation, data minimisation and retention controls.
3. Use representative, high-quality labelled data and document label limitations.
4. Measure precision, recall, false-positive rates, false-negative risk and operational workload by segment.
5. Test for disparate impact and proxy variables; avoid unsupported customer profiling.
6. Version rules, thresholds, feature definitions and datasets.
7. Keep a reproducible record of the signal explanations shown to an investigator.
8. Require human review and documented rationale for material decisions.
9. Monitor drift, data quality, alert volumes and investigator overrides.
10. Establish independent validation, change approval and rollback procedures.

This prototype has no trained model, validation dataset, fairness testing or formal model-risk approval. Its rules and thresholds are educational examples only.
