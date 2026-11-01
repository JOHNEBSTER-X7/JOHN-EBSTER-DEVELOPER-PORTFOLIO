# Northstar Cloud Infrastructure & DevOps Platform

A cloud operations and deployment control-plane portfolio project. It demonstrates a service catalogue, release readiness checks, approval-controlled deployment lifecycle, operational event stream, Docker packaging and Kubernetes manifests.

## Features

- Service catalogue and service health status.
- Semantic-version and service-health readiness policies.
- Deployment request and approval state machine.
- Human approval required before simulated execution.
- Deployment history, operational events and dashboard metrics.\n- Prometheus-compatible metrics endpoint (`/api/metrics`) and example scrape configuration.
- Multi-stage Dockerfile, Compose configuration and Kubernetes Deployment/Service manifests.
- Express API, TypeScript, Zod and Vitest.

## Run locally

Requires Node.js 22+.

    cd projects/devops/cloud-infrastructure-platform
    npm install
    npm run dev

Open http://localhost:3400.

## Docker

    docker build -t northstar-cloud-platform .
    docker run --rm -p 3400:3400 northstar-cloud-platform

Or use Docker Compose:

    docker compose up --build

## Checks

    npm run typecheck
    npm test
    npm run build

## Kubernetes example

See infra/kubernetes/deployment.yaml. Replace the sample image reference with your own published image and configure namespace, ingress/TLS, secrets, image pull credentials, policies and resource limits for your cluster.

## API

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/health | Health endpoint |
| GET | /api/dashboard | Platform metrics, services and events |
| GET | /api/services | Service catalogue |
| GET/POST | /api/deployments | List and request releases |
| GET | /api/deployments/:id | Deployment details |
| POST | /api/deployments/:id/approval | Approve or reject |
| POST | /api/deployments/:id/execute | Simulate an approved release |

## Important scope boundary

The deployment execution endpoint simulates a successful release in the local in-memory control plane. It does not connect to AWS, Azure, GCP, Kubernetes or a production environment. The Kubernetes YAML is a reference manifest, not proof of a running cluster. No cloud credentials are required or stored.

## Production engineering still required

Persistent release records, authentication, role-based access, signed artefacts, image scanning, secrets management, policy-as-code, real cluster adapters, rollback automation, audit storage, observability and disaster recovery.
