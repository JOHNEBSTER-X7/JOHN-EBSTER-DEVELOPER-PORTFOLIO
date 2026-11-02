# Architecture

Express routes validate JSON input using Zod. A domain service maintains devices, service identities, network policies, flow decisions and audit entries in process memory.

## Trust evaluation
Device trust is a demonstration score: 40 points for managed, 40 for compliant and a fixed 20-point baseline. Scores of 80+ are trusted, 40–79 restricted and below 40 blocked. A policy can require a registered device and a minimum score.

## Flow decision sequence
1. Resolve optional device and workload identity references.
2. Reject unknown or blocked devices, inactive identities and identity/source-zone mismatches.
3. Find enabled policies matching source zone, destination zone, port and optional service identity.
4. Require device evidence and minimum trust where policy says so.
5. Apply the matching policy decision; if no applicable policy exists, default deny.
6. Store decision reasons and append an audit record.

The segmentation matrix is a suggested illustrative zone map, not an enforced network ACL.