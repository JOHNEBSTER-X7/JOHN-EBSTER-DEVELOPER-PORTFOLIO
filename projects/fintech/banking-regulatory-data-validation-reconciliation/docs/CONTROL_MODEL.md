# Validation, reconciliation and submission control model

1. Ingest a period-scoped dataset with source attribution.
2. Apply active field-level validation rules.
3. Route exceptions into an owned issue queue; resolved or waived issues require rationale.
4. Compare two datasets for a shared period using a business key, value field and explicit tolerance.
5. Create a submission gate for the period and required datasets.
6. The gate remains blocked if datasets are missing, period mismatches exist, unresolved validation issues remain, or no fully matched reconciliation includes a required dataset.
7. A controller records approval only when all checks pass.

## Reconciliation semantics
Records are matched on the string form of the configured key. Missing records, non-numeric values and differences above tolerance become exceptions. Differences within tolerance are treated as matched. This simple model does not perform FX conversion, accounting sign normalization, aggregation, many-to-one matching or temporal alignment.

## Governance notes
Severity is a triage label. Materiality is represented by the explicitly configured numeric tolerance, not inferred from severity. User attribution is a caller-supplied header in this demo and must not be trusted as an identity assertion in production.
