# Banking event contract

## Envelope

```json
{
  "eventId": "evt-pay-000001",
  "eventType": "payments.payment.created",
  "schemaVersion": "1.0",
  "source": "payments",
  "occurredAt": "2026-11-01T10:00:00.000Z",
  "correlationId": "corr-payment-001",
  "subjectId": "payment-001",
  "payload": {
    "currency": "GBP",
    "amountMinor": 125000
  }
}
```

The platform assigns `offset` and `acceptedAt` on successful append.

## Registered initial schemas

| Event type | Version | Required payload fields |
|---|---|---|
| payments.payment.created | 1.0 | currency, amountMinor |
| payments.payment.status_changed | 1.0 | status |
| treasury.liquidity.warning | 1.0 | currency, availableMinor |
| fraud.alert.created | 1.0 | severity, reference |
| aml.case.updated | 1.0 | caseStatus |
| reconciliation.break.created | 1.0 | breakReference, amountMinor |
| operations.alert.actioned | 1.0 | action, actor |

## Contract rules

- Event IDs are producer idempotency keys.
- Event types are namespaced to their source domain.
- Schema versions use major.minor notation.
- Timestamps are ISO 8601.
- Correlation IDs join records from one business workflow.
- Subject IDs identify the source-domain aggregate.
- Payloads should contain only data required by downstream consumers.

This implementation validates required field presence, not full JSON Schema types, compatibility, evolution or semantic constraints. A production schema registry must add those controls.
