# Architecture

The API layer uses Express and Zod to validate incoming canonical records. The WarehouseService is the domain layer for ingestion, deduplication, date/domain filtering, aggregation, lineage, quality checks and exports. The demo process seeds synthetic fixture records at startup.

## Data flow

1. Source system submits a canonical record with source, batch ID, domain, timestamp, currency, amount, status and reference.
2. Zod validates the API contract.
3. WarehouseService rejects duplicate batch IDs and appends an in-memory record.
4. Reporting endpoints derive domain aggregates from the canonical record collection.
5. Quality, lineage and audit endpoints expose controls and provenance.

## Design decisions

- Integer minor units avoid floating-point money arithmetic.
- Currency remains a grouping dimension; GBP, USD and EUR are not summed together.
- Batch-level idempotency prevents repeated submission of the same batch key.
- Report generation is deterministic over the current in-memory dataset.
- Domain types are constrained to six banking domains.
