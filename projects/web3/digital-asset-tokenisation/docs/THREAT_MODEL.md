# Threat model and review checklist

| Threat | Demo mitigation | Production requirement |
|---|---|---|
| Unapproved wallet transfer | Allowlist checks on mint and transfer | Legal policy mapping, verified onboarding, periodic review |
| Privileged key compromise | AccessControl role boundaries | Multisig, timelock, hardware-backed keys, rotation |
| Emergency incident | Admin pause | Documented incident command and recovery procedures |
| Repeated distribution claim | Claimed flag and reentrancy guard | Independent audit and transaction monitoring |
| Over-allocation | Funding bound check | Accounting reconciliation and robust allocation governance |
| Fake indexed event | Schema validation and dedupe | RPC verification, ABI decoding, confirmations and reorg recovery |
| Misleading asset metadata | Issuer and URI recorded | Independent title/custody evidence, legal review and provenance controls |

This is a design exercise, not a completed audit. No contract should be used with real assets or funds without independent professional review.
