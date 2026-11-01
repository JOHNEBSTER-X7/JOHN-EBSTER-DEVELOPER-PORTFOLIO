# Architecture

## Request flow

1. Client submits a PDF, TXT or Markdown file to `POST /documents`.
2. API validates extension, payload size and text extraction.
3. Text is normalised and divided into overlapping chunks.
4. Original file is stored under a generated opaque identifier; document metadata and chunks are persisted in SQLite.
5. A question to `POST /ask` is tokenised and matched against stored chunks.
6. Ranked passages are returned with filename, PDF page (where available), chunk index and a relevance score.

## Design decisions

- **Local-first storage:** SQLite keeps the demo easy to run without cloud credentials.
- **Explainable baseline:** lexical overlap avoids claiming semantic understanding that the implementation does not yet provide.
- **Evidence-first output:** the API returns source passages rather than fabricating a natural-language synthesis.
- **Bounded uploads:** extension allow-list and 10 MB request limit reduce accidental oversized uploads; production deployments still need deeper file inspection.
- **Replaceable retrieval:** `retrieve()` is a clear seam for a future embedding and vector-index implementation.

## Data model

- `documents`: identifier, filename, media type and creation timestamp.
- `chunks`: document reference, optional page number, per-page chunk index and extracted text.

## Trust boundaries and risks

The service currently has no user identity, access-control policy, tenant boundary, antivirus scanning, encryption-at-rest configuration, retention scheduler or audit trail. Treat it as a local demonstration only. A production implementation must add these controls before handling sensitive documents.
