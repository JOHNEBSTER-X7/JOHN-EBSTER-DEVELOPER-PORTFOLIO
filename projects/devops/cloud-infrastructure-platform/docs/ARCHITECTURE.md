# Architecture and deployment lifecycle

The Express service provides a service catalogue, readiness policy, deployment request API and approval-controlled state transitions. A small in-memory store models services, deployments and events.

## Lifecycle

1. A requester selects a registered service, environment and semantic version.
2. Readiness policy checks version syntax and service health.
3. A valid request is created in pending_approval.
4. An authorised human decision is represented by the approval endpoint.
5. Only approved requests can reach the simulated execution endpoint.
6. The local catalogue version and event stream are updated.

The current application does not authenticate the requester or approver. The approval endpoint is a demonstration of state-machine behaviour, not a secure production authorisation mechanism.

## Container

The multi-stage Dockerfile compiles TypeScript in a build stage and runs the compiled application in a non-root Node.js container. Compose demonstrates a read-only root filesystem and no-new-privileges option.

## Kubernetes

The manifest defines two replicas, a ClusterIP Service, readiness and liveness probes, resource requests/limits and a restricted container security context. Image, namespace, secrets, ingress, autoscaling and policy configuration must be supplied for a real cluster.

## Production evolution

Use a durable database, OIDC identity, RBAC, signed release artefacts, admission policies, image scanning, external secret manager, deployment adapters, progressive delivery, automated rollback, audit events and metrics/tracing.
