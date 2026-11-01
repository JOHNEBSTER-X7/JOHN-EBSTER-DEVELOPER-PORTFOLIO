# Interview guide

## 60-second explanation

I built a cloud deployment control-plane prototype that models a service catalogue, release readiness policies, deployment requests, approval gates and deployment history. I packaged the API with a multi-stage Dockerfile and supplied Kubernetes manifests with health probes, resource limits and a restricted security context. The execution flow is explicitly simulated; it does not claim to deploy to a real cloud account.

## Questions

**What is a readiness check?** A pre-release policy that checks semantic version syntax and current service health before a deployment request is accepted.

**Why require approval?** Production releases are consequential. The state machine requires an explicit approval transition before simulated execution.

**What does Docker improve?** Reproducible packaging and a clear build/runtime boundary. The runtime uses a non-root user and health check.

**What does Kubernetes provide here?** A declarative reference deployment with replicas, service discovery, probes, resource bounds and container security context.

**How would you make this real?** Add authenticated RBAC, durable state, signed build artefacts, registry scanning, secrets management, Kubernetes client adapters, progressive delivery, rollback, audit logs and observability.
