# Monitoring example

The application exposes Prometheus text exposition at GET /api/metrics. The supplied prometheus.yml shows a basic scrape job for a Compose service named northstar-ops.

To use it, add a Prometheus service to docker-compose.yml, mount this configuration at /etc/prometheus/prometheus.yml, and ensure both services share the Compose network. This repository keeps the monitoring configuration separate so users can choose their own observability stack.

Metrics are in-process prototype counters and gauges, not durable telemetry. Add request latency, error rates, saturation, deployment duration, alert rules, retention, authentication/network controls and dashboards before production use.
