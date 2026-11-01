# Kubernetes example

This manifest is a deployment template, not a live cluster deployment. Replace the example image with an image built and published by your organisation. Configure namespace, imagePullSecrets, ingress/TLS, resource quotas, network policies, secrets, autoscaling, pod disruption budgets and persistent dependencies for your environment.

Validate locally with:

    kubectl apply --dry-run=client -f infra/kubernetes/deployment.yaml

No cluster credentials or cloud account are required by this repository's CI.
