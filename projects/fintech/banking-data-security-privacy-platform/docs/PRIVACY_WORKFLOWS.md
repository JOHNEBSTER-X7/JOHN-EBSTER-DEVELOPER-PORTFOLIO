# Privacy and lifecycle workflows

## Data subject requests
Supported request types are access, rectification, erasure, restriction and portability. The sample state path is received → identity_verified → in_progress → fulfilled, with rejection available before completion. This service tracks workflow state only; it does not verify identity, retrieve records, alter source data or execute erasure.

## Consent
A consent record is associated with a subject and purpose. The latest recorded decision is used; a grant is valid only when it has not expired. This is a technical demonstration and does not determine the lawful basis for processing.

## Retention
A dataset schedule defines a positive whole number of days. Eligibility is calculated from a supplied creation timestamp. A legal hold prevents an eligible result. No data is automatically destroyed.

## Access requests
Requests may be approved or rejected once. An approval can carry an expiry timestamp. This is a workflow record and does not itself grant access to a real data store.
