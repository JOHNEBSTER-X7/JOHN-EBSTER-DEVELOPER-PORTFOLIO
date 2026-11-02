# Detection and response model

Starter rules cover authentication failures, failed privileged operations and service-account activity. Additional rules can match event type, outcome, actor substring or exact IP. Threat indicators are manually ingested and retain type, normalized value, confidence and source.

Severity is derived from a simple score band: low under 40, medium 40–69, high 70–89 and critical 90+. Rule scores are summed with a small confidence contribution for matched indicators and capped at 100. This is an explainable demo heuristic, not a calibrated risk model.

Playbooks are deliberately dry-run only. The API returns a simulation result and audit event; it never executes endpoint, network, identity or messaging actions.