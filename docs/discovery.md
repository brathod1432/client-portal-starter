# Discovery & Product Roadmap

> Phase 1 deliverable. Establishes the vision, users, architecture direction,
> security objectives and risks before implementation.

## Product Vision

A **secure, accessible, enterprise-grade client portal starter** that any
service business can adopt to give their customers a single, trustworthy place
to see their projects, raise and track support tickets, exchange documents,
pay invoices, and message their account team.

The starter optimizes for four outcomes, in priority order:

1. **Security** — least-privilege access, hardened defaults, auditable actions.
2. **Maintainability** — typed, modular, documented, tested.
3. **Scalability** — clean data boundaries ready for a real backend.
4. **Experience** — premium, accessible (WCAG AA), fast, modern.

It ships as a **client-only mock** (no server) so it runs instantly and is easy
to evaluate, but every architectural decision is made so the mock can be
swapped for a production backend with minimal churn (see
[architecture.md](./architecture.md)).

## Typical Client Portal Use Cases

- **Status transparency** — customers self-serve project/engagement status
  instead of emailing for updates.
- **Support** — customers raise tickets, track resolution, and see history.
- **Document exchange** — contracts, reports and deliverables shared securely
  with version history and per-role visibility.
- **Billing** — customers view statements, download invoices, and pay online.
- **Communication** — a durable, searchable channel that replaces scattered
  email threads.
- **Trust & compliance** — an activity/audit trail of security-relevant events.

## User Personas

| Persona                     | Role      | Goals                                           | Pain today                                            |
| --------------------------- | --------- | ----------------------------------------------- | ----------------------------------------------------- |
| **Ava — Client**            | `client`  | See project status, raise tickets, pay invoices | Chasing updates over email; no single source of truth |
| **Marcus — Support Agent**  | `agent`   | Triage & resolve tickets, share files           | Context spread across tools                           |
| **Priya — Account Manager** | `manager` | Own the relationship, manage billing & delivery | No consolidated client view                           |
| **Devon — Administrator**   | `admin`   | Configure the platform, manage users & policy   | Access sprawl, weak audit                             |

## Architecture Proposal

- **Next.js (App Router) + TypeScript** for a typed, server-capable React app.
- **Tailwind CSS v4 + shadcn/ui (Radix primitives)** for an accessible,
  themeable design system.
- **Zustand** for lightweight client state (auth, mutable demo data, settings).
- **TanStack Query** wired in, ready to back modules with a real API.
- **Zod + React Hook Form** for validation shared between client and (future)
  server.
- **RBAC module** as the single source of truth for authorization.
- **Mock data layer** behind a barrel export — the seam to a real data source.

See [architecture.md](./architecture.md) for the full picture.

## Security Objectives

1. Deny-by-default authorization enforced through one RBAC module.
2. Client route guards for UX; documented server enforcement for production.
3. Hardened HTTP security headers (CSP, HSTS, frame-deny, nosniff, etc.).
4. Validated inputs at every boundary via shared Zod schemas.
5. No secrets in the client; typed, validated environment variables.
6. Full activity/audit trail of security-relevant events.
7. Session hygiene: idle timeout, and a documented httpOnly-cookie model.

See [security-implementation.md](./security-implementation.md) and
[security-model.md](./security-model.md).

## Expansion Opportunities

- Real auth (OIDC/SAML SSO, passkeys, TOTP MFA).
- Server persistence (Postgres/Prisma), object storage for documents.
- Payments (Stripe) with server-issued intents and webhooks.
- Realtime messaging & notifications (WebSocket/SSE).
- AI assistant, document Q&A, ticket summarization (see
  [ai-readiness.md](./ai-readiness.md)).
- Multi-tenancy & white-labelling (see [customization.md](./customization.md)).

## Risks

| Risk                                           | Likelihood | Impact | Mitigation                                         |
| ---------------------------------------------- | ---------- | ------ | -------------------------------------------------- |
| Client-only auth mistaken for production-ready | Med        | High   | Prominent notes in code + docs; guard is UX-only   |
| Bleeding-edge deps (Next 16, Tailwind v4)      | Med        | Med    | Pinned versions; documented in security-governance |
| Scope creep across many modules                | High       | Med    | Shared primitives; consistent patterns             |
| Accessibility regressions                      | Med        | High   | axe in CI (jest + Playwright), semantic HTML       |

## Assumptions

- The evaluator wants a runnable, self-contained demo (no backend required).
- Data is seeded/mock; user actions persist for the session only.
- The consuming team will replace the mock data layer and auth store with real
  services following the documented seams.

## Roadmap (implementation order)

1. Foundation: scaffold, design tokens, UI primitives, providers, security headers.
2. Domain: types, RBAC, mock data, stores, validation.
3. Shell & auth: layout, nav, guard, login/register/forgot.
4. Modules: dashboard → projects → tickets → documents → invoices → messages →
   notifications → profile → settings → help → activity → showcase.
5. UX hardening: command palette, idle timeout, error/loading/not-found.
6. Quality: tests (unit/component/a11y/e2e), lint/format/typecheck, screenshots.
7. Docs & delivery: full documentation set, README, audits.
