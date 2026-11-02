# Governance model

- **Data owner:** accountable business role recorded on a dataset.
- **Data steward:** operational contact for definitions, quality and metadata.
- **Classification:** public, internal, confidential or restricted label.
- **Schema lifecycle:** monotonically versioned draft schemas can be approved by a named actor.
- **Quality controls:** not-empty, unique, non-negative, allowed-values and ISO date-time checks.
- **Findings and issues:** validation findings can be linked to owned remediation issues.
- **Lineage:** directed dataset-to-dataset edges document declared upstream/downstream relationships.
- **Audit:** append-in-memory activity records identify actor, action and detail.

These are governance concepts demonstrated in code, not proof of regulatory compliance or enforcement of access restrictions.
