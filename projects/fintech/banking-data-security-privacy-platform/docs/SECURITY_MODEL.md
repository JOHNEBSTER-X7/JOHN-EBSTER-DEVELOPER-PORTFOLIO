# Security model and control catalogue

## Demonstrated controls
- Default-deny policy matching across role, dataset, action and purpose.
- Consent latest-decision and expiry evaluation.
- Optional access approval and expiry metadata.
- Legal-hold override during retention eligibility assessment.
- Explicit masking of nominated sensitive fields.
- Controlled privacy-request and incident transitions.
- Actor labels and event history for review.

## Not implemented
No authentication, identity proofing, authorization middleware, tenant isolation, encryption, key management, secrets management, immutable audit storage, rate limiting, network policy, data-loss prevention or actual source-system enforcement is provided. The x-actor header is an untrusted demonstration label, not proof of identity.

## Production design requirements
Integrate an enterprise identity provider and MFA; enforce authorization at every data access boundary; persist policies with versioning and approvals; use managed encryption and keys; isolate tenants; secure and monitor audit records; define incident response and recovery; test policy bypasses; and obtain independent penetration testing and legal review.
