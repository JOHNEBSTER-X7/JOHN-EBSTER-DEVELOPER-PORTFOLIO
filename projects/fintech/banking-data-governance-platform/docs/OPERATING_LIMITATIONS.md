# Operating limitations and production roadmap

The prototype stores state in process memory; restart loses all data. It has no authentication or role-based authorisation, so actor headers are attribution only. Sensitive-field markers and classification labels do not mask or protect data. There is no policy engine, approval segregation enforcement, schema compatibility analysis, automated discovery, metadata harvesting, scheduled quality scans, lineage graph traversal, retention control, evidence export or regulator mapping.

A production design would require durable transactional storage, identity integration, least-privilege authorisation, encryption, audit immutability, policy enforcement, version compatibility rules, data contracts, monitored pipelines, backup/recovery, privacy assessment and independent security/compliance review.
