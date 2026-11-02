# Architecture

Express routes validate inputs with Zod and delegate to an in-memory domain service. The service evaluates events against enabled detection rules and active threat indicators, records explainable match identifiers, calculates an illustrative severity score, and opens incidents for high/critical events. Vulnerabilities and incident workflows are tracked independently. Each state-changing operation appends an actor-labelled audit record.

## Event flow
1. Validate the event envelope.
2. Enforce external event ID idempotency when supplied.
3. Match enabled rules and active IP/domain/hash indicators.
4. Calculate a capped score and severity band.
5. Store the event, audit ingestion, and open an incident when severity is high or critical.

All timestamps are server-generated ISO strings except the optional source occurrence timestamp.