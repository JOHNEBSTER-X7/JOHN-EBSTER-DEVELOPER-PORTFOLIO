# Workflow orchestration model

## Lifecycle
A workflow is created for one active obligation, legal entity and reporting period. Duplicate obligation/period runs are rejected. Eight tasks form a sequential dependency chain. A task cannot be completed until its predecessor is complete.

## Reporting pack and approvals
The first six tasks are prerequisites for pack generation. All eight tasks must be complete before approval. The initial task owner cannot perform independent review, and the initial preparer cannot approve the workflow. These checks are illustrative maker-checker controls, not identity security.

## Submission
The local submission event requires a recorded approver and is idempotency-protected by a submitted timestamp. It does not connect to a regulator, create a regulator-compliant file or transmit data.

## Audit
State-changing actions create timestamped events in process memory. Production systems need durable, append-only and tamper-evident audit storage.
