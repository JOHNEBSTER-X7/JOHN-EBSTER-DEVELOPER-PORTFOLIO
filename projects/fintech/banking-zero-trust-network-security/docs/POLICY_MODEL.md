# Policy model

A policy contains a name, source zone, destination zone, allowed port list, decision, rationale, optional service identity binding, and device posture requirements. Supported zones are internet, DMZ, application, database, admin and third-party. Policy matching is exact for zones and ports.

The first matching policy is used. Production systems should define explicit policy priority, conflict detection, versioning, approval, expiry, change simulation and rollback. The current prototype does not implement those controls. An explicit deny policy remains deny; absent a matching policy, traffic is denied.