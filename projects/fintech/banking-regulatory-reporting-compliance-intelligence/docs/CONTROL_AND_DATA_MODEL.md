# Control and data model

## Obligation register
Each obligation is associated with a jurisdiction, legal entity, reporting owner, frequency, due date and source label. Seeded records are synthetic and explicitly labelled as such.

## Report lifecycle
`draft → in_review → approved → submitted`. Validation requires reporting entity, period end, currency and preparer. The approver must differ from the report owner. Rejected is reserved as a stage for future workflow extensions; this prototype does not implement rejection routing.

## Regulatory change
Change records capture a source URL, jurisdiction, publication/effective dates, impact tier, owner and a written assessment. The status can be new, assessing, action required or closed.

## Auditability
Mutations append actor, action, target, detail and timestamp to a process-local event list. This is demonstrative logging, not tamper-evident evidence.
