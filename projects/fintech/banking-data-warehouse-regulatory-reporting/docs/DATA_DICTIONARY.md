# Data dictionary

| Field | Meaning |
|---|---|
| id | Warehouse-generated record identifier |
| source | Originating system label |
| batchId | Caller-supplied idempotency key |
| domain | payments, treasury, fraud, aml, reconciliation or operations |
| type | Source event or record classification |
| occurredAt | Source event time in ISO 8601 |
| currency | ISO-style three-letter currency code |
| amountMinor | Signed integer in minor currency units |
| status | Domain-specific lifecycle or severity |
| reference | Source business reference |
| attributes | Additional structured source attributes |
| ingestedAt | Warehouse receipt timestamp |

The prototype does not infer a universal meaning for amount signs or status values across domains. Domain-specific semantics must be agreed in a production data contract.
