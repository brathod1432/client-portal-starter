# Improvements Report — Making the Portal Genuinely Useful

> A practical, user-first analysis of how this portal becomes more useful in
> real life, plus a dedicated security section. Items marked **✅ Implemented**
> were added in this iteration; **▶ Recommended** items are the prioritized next
> steps with rationale.

---

## How a real user actually experiences the portal

Put yourself in Ava's shoes (a client). She logs in to answer very concrete
questions: _"Where's my project? Do I owe money? Did support reply? Where's that
contract?"_ A portal is useful only if those answers are **one glance or one
click away**, and if the actions she takes **actually do something**. The
changes below are organized around that lived experience.

---

## 1. Make it feel alive — actions that actually work ✅

A demo that only shows static data feels fake and undermines trust. This
iteration made the core actions real (persisted for the session):

- **✅ Create a ticket** end-to-end (validated form → appears in list & detail
  with an opening timeline event → audit-logged).
- **✅ Reply on a ticket** and **change status / assign** (agent+), each adding a
  timeline event.
- **✅ Send messages** in conversations (Enter to send), with unread handling.
- **✅ Pay an invoice** (confirmation dialog → status → transaction history) and
  **download** invoices/documents (real files generated in-browser).
- **✅ Upload a document** (adds to the list) and **view version history**.
- **✅ Update profile & settings** (2FA toggle, notification prefs, theme) that
  persist.

**Why it matters:** every click produces visible, believable feedback — the
difference between a screenshot and a product.

## 2. Get to the answer faster ✅ / ▶

- **✅ Command palette (Cmd/Ctrl+K)** — jump to any page, project, ticket or
  document instantly. This is the single biggest daily-usability win for power
  users.
- **✅ Filtering, sorting & pagination** on lists (TanStack Table) and search on
  tickets/projects/documents.
- **✅ Breadcrumbs** on detail pages for orientation.
- **✅ Dashboard "answers"** — outstanding balance, open tickets, unread
  messages, next payment due, overdue-invoice alert, upcoming tasks.
- **▶ Saved views / smart filters** (e.g. "My open tickets", "Overdue only").
- **▶ Global search backed by an API** with typeahead across all entities.

## 3. Reduce anxiety & surprises ✅ / ▶

- **✅ Clear empty, loading and error states** (`EmptyState`, `Skeleton`,
  route `loading.tsx`, `error.tsx`, `not-found.tsx`).
- **✅ Toast feedback** on every action (success/failure).
- **✅ Idle session timeout** with a pre-warning — protects shared machines.
- **▶ Optimistic updates + rollback** once a backend exists (instant feel).
- **▶ Undo** for destructive/irreversible actions (e.g. "message sent" undo
  window).

## 4. Communication that respects the user ✅ / ▶

- **✅ Notification center** with unread badges, mark-as-read/all, deep links.
- **✅ Notification preferences** (email, ticket updates, invoice reminders,
  weekly digest, announcements) in Settings.
- **▶ Real delivery channels** — transactional email/SMS/push honoring those
  preferences; a digest scheduler.
- **▶ Realtime** message/notification updates (WebSocket/SSE) so replies appear
  without refresh.

## 5. Trust, transparency & self-service ✅ / ▶

- **✅ Activity log** the user can read and **export to CSV** — "what happened on
  my account, and when".
- **✅ Permission indicators** on documents ("visible to N roles", confidential
  lock) so sharing is transparent.
- **✅ Account status** widget (plan, support tier, renewal).
- **▶ Data export ("download my data")** and self-service **account deletion**
  request flow (GDPR-friendly; modeled in Settings today).
- **▶ Status page / maintenance banners** driven by announcements.

## 6. Accessibility & inclusivity ✅

- **✅ WCAG AA focus**: skip link, keyboard nav, visible focus, labeled controls,
  `aria-invalid`/`role="alert"` on forms, `prefers-reduced-motion` + a Reduce
  Motion toggle, dark mode. Verified with jest-axe and axe-playwright.
- **▶ Screen-reader-friendly chart fallbacks** (data tables) for critical KPIs.
- **▶ Localization (i18n)** — the app already uses `Intl` for dates/currency and
  stores locale/timezone; add message catalogs next.

## 7. Performance ✅ / ▶

- **✅ Code-splitting** per route; **dynamic import** of charts to shrink the
  dashboard's initial JS; skeletons during load.
- **▶ Lighthouse budget in CI**; image optimization for any real assets;
  prefetch on hover for common routes.

## 8. Personalization & onboarding ▶

- **▶ First-run checklist / product tour** ("complete your profile", "add a
  payment method").
- **▶ Dashboard the user can arrange** (reorder/hide widgets), remembered per
  user.
- **▶ Per-user saved preferences** synced server-side (today they're local).

---

## Security improvements (dedicated)

Security is the #1 priority. The starter ships a strong **client** posture and
**documents** the server-side controls required for production. Highlights:

### Implemented this iteration ✅

- **Central, deny-by-default RBAC** (4 roles, explicit matrix) driving UI
  visibility, with unit + e2e coverage.
- **Hardened HTTP headers** — CSP, HSTS, `X-Frame-Options: DENY`,
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `poweredByHeader:false`.
- **Input validation everywhere** via shared Zod schemas (client today, reusable
  server-side).
- **Anti-enumeration** auth + password reset (generic responses).
- **Idle session timeout**; **no secrets in client**; **validated public env**.
- **Audit trail** of security-relevant actions; **per-role data scoping** for
  documents and activity.
- **Strong password policy** with a live strength meter.
- **0 dependency vulnerabilities** (`npm audit`), pinned versions, reverted an
  accidental pre-release dependency.

### Recommended next (prioritized) ▶

1. **Server-issued sessions in httpOnly, Secure, SameSite cookies** — replace
   `localStorage` (which is XSS-exfiltratable). _Highest impact._
2. **Server-side authorization** — enforce the same RBAC matrix in
   `middleware.ts` and every API handler, plus **row-level** checks so a user
   can only access their own data.
3. **MFA (TOTP/passkeys)**, **password hashing (argon2id)**, **rate limiting**
   and **account lockout** on auth endpoints.
4. **CSRF protection** — SameSite cookies + per-session CSRF tokens on mutations.
5. **Secure file pipeline** — type/size validation, magic-byte sniffing, signed
   URLs, and **antivirus scanning** before downloadability.
6. **Nonce-based CSP** — remove `'unsafe-inline'`/`'unsafe-eval'` for scripts.
7. **Server-authoritative audit log** (append-only) with real `ip`/`device`,
   forwarded to a SIEM.
8. **Supply-chain security in CI** — `npm audit`, CodeQL/SAST, secret scanning,
   Dependabot/Renovate, and SBOM generation.
9. **Data protection** — encryption at rest, retention policies, DSAR/export &
   deletion flows, PII redaction in logs/telemetry.
10. **Payments** — never handle card data directly; use a PCI-compliant provider
    with server-side intents and verified webhooks.

---

## Prioritized backlog (at a glance)

| Priority | Item                                                               | Type     | Status  |
| -------- | ------------------------------------------------------------------ | -------- | ------- |
| P0       | Server sessions (httpOnly cookies) + server RBAC                   | Security | ▶       |
| P0       | Persistence (DB) + real API via TanStack Query                     | Platform | ▶       |
| P1       | MFA, rate limiting, lockout, CSRF                                  | Security | ▶       |
| P1       | Secure file uploads (validate/sign/AV)                             | Security | ▶       |
| P1       | Realtime messages/notifications + email delivery                   | UX       | ▶       |
| P2       | Nonce-based CSP                                                    | Security | ▶       |
| P2       | Optimistic updates + undo                                          | UX       | ▶       |
| P2       | i18n, chart SR fallbacks                                           | A11y/UX  | ▶       |
| P3       | Onboarding tour, customizable dashboard                            | UX       | ▶       |
| —        | Command palette, real actions, filters, idle-logout, a11y, exports | Multiple | ✅ done |

The **▶ Recommended** items are intentionally out of scope for a client-only
starter but are documented end-to-end so a team can implement them confidently.
