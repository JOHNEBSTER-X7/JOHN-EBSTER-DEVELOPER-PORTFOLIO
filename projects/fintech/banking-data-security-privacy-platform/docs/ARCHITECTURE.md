# Architecture

The application separates an Express transport layer from a domain service. Zod validates incoming payloads before service methods are called. The service owns policy, consent, retention, privacy-request, access-request and incident state, and emits actor-labelled audit events.

## Decision flow
1. A caller submits role, dataset, action and purpose.
2. The evaluator searches enabled policies for an exact match.
3. No match results in denial; a match returns its policy identifier.
4. The evaluation is recorded in the audit stream.

## Workflow boundaries
Privacy requests and incidents use explicit state-transition maps. Retention evaluation computes an advisory due date and honours legal holds. Sensitive-field masking operates on a copied record so the input object is not mutated.

## Runtime
A single Node.js process serves the API. All state is held in process memory. There is no database, queue, external identity service or distributed policy decision point.
