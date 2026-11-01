# Event contract — version 1.0

Every event uses this envelope:

```json
{
  "eventId": "evt-pay-000001",
  "eventType": "payments.payment.status_changed",
  "schemaVersion": "1.0",
  "source": "payments",
  "occurredAt": "2026-11-01T10:00:00.000Z",
  "correlationId": "corr-payment-001",
  "subjectId": "payment-001",
  "payload": {
    "status": "settled",
    "currency": "GBP",
    "amountMinor": 125000
  }
}
```

## Rules

- `eventId` is the producer-generated idempotency key.
- `eventType` must be namespaced by the source domain, e.g. `treasury.liquidity.warning`.
- `schemaVersion` is explicitly `1.0` in this release.
- `occurredAt` is an ISO 8601 timestamp.
- `correlationId` joins events in a business workflow.
- `subjectId` identifies the payment, case, account or reconciliation break in the source domain.
- `payload` is domain data; avoid unnecessary personal or sensitive data.

## Supported source domains

`payments`, `treasury`, `fraud`, `aml`, `reconciliation`, `operations`.

## Example event types

- `payments.payment.created`
- `payments.payment.status_changed`
- `treasury.liquidity.warning`
- `fraud.alert.created`
- `aml.case.updated`
- `reconciliation.break.created`
- `operations.alert.actioned`

This is an illustrative contract. It is not yet a formally governed schema registry or a backwards-compatibility guarantee.
