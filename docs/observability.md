# Observability

> Phase 19 deliverable. How the starter is structured for logging, monitoring,
> health checks, tracing, error reporting and analytics — and the recommended
> production wiring.

## Philosophy

Instrument for **security, reliability and product insight** without leaking
PII. Prefer structured, correlated telemetry over ad-hoc logs.

## Audit trail (implemented)

The **activity log** is the security-facing observability feature. Every
security-relevant action calls `useActivityStore.log(action, actor, target,
metadata)`:

- login / logout (incl. idle-timeout logout)
- profile update, settings update
- document download / upload
- ticket create / update, message sent
- invoice view / payment

Rendered at `/activity-log` with per-role scoping (self vs. org-wide) and CSV
export. **Production:** derive `actor`, `ip`, `device`, `timestamp` server-side,
persist to an append-only store, and forward to your SIEM.

## Logging (production design)

- **Structured JSON logs** (e.g. pino) with a correlation/request id.
- Levels: `error/warn/info/debug`; never log secrets, tokens or full PII.
- Ship to a log aggregator (Datadog, Loki, CloudWatch, ELK).

## Error reporting (implemented hook point)

- `app/error.tsx` is the App Router error boundary; it currently
  `console.error`s and shows a friendly recovery UI with an error `digest`.
- **Production:** forward to Sentry/Rollbar (`NEXT_PUBLIC_SENTRY_DSN` placeholder
  in `.env.example`). Attach the digest for correlation.

## Monitoring & metrics (production design)

- RED metrics (Rate, Errors, Duration) per route/handler.
- Web Vitals (LCP/INP/CLS) via `next/web-vitals` → analytics.
- Business metrics: tickets opened/resolved, invoice payments, logins.
- Dashboards + alerting (Grafana/Datadog) on error rate, latency, auth failures.

## Health checks (production design)

- `GET /api/health` (liveness) and `/api/ready` (readiness: DB, storage,
  payments reachable) for load balancers / k8s probes.

## Tracing (production design)

- **OpenTelemetry** spans across request → handler → DB/storage/payment calls,
  propagating trace context; export to Tempo/Jaeger/Honeycomb.

## Analytics (production design)

- Privacy-respecting product analytics (PostHog/Plausible) gated on consent;
  public key via `NEXT_PUBLIC_ANALYTICS_ID`. Track funnels (login → action)
  without capturing sensitive field values.

## Data protection in telemetry

- Redact PII/secrets at the logger boundary.
- Separate audit (security) from product analytics.
- Define retention windows per data class; document in your privacy policy.
