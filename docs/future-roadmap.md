# Future Roadmap

Prioritized by our standing order: **Security → Maintainability → Scalability →
Accessibility → UX → Performance → Visual design.**

## Now → Next (production-ize the mock)

1. **Real authentication** — server sessions (httpOnly cookies), OIDC/SAML SSO,
   TOTP MFA / passkeys, password hashing, lockout & rate limiting.
2. **Server-side authorization** — enforce the RBAC matrix in `middleware.ts`
   and API handlers; row-level authorization for all data.
3. **Persistence** — Postgres + Prisma; replace store internals with TanStack
   Query hooks against real endpoints.
4. **Documents** — object storage (S3/Azure Blob), signed URLs, type/size
   validation, AV scanning, real version history.
5. **Payments** — Stripe (server intents + webhook verification) for invoices.
6. **CSRF + hardened CSP** — tokens on mutations; nonce-based CSP.

## Later

7. **Realtime** — WebSocket/SSE for messages, notifications and ticket updates.
8. **Notifications** — email/SMS/push with the existing preference model.
9. **Multi-tenancy & white-labelling** — per-tenant theming, domains, data
   isolation.
10. **Admin console** — user/role management UI, org settings, feature flags.
11. **Observability** — Sentry, OpenTelemetry tracing, health checks, dashboards.
12. **i18n/l10n** — message catalogs; the app already uses `Intl` for dates/
    currency and stores a locale/timezone.

## Exploratory

13. **AI features** — assistant, knowledge search, document Q&A, ticket
    summarization (see [ai-readiness.md](./ai-readiness.md)).
14. **Mobile app** — reuse the API with a React Native client.
15. **Analytics & reporting** — exportable dashboards, scheduled reports.
16. **E-signatures** and **appointment scheduling** modules.

## Continuous

- Dependency hygiene (Dependabot/Renovate), `npm audit` + SAST in CI.
- Accessibility & performance budgets enforced in CI.
- Raise test coverage thresholds as the codebase matures.
