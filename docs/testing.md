# Testing Strategy

> Phase 18 deliverable. A layered strategy: fast unit/component tests in Jest +
> React Testing Library, accessibility checks with axe, and end-to-end flows
> with Playwright.

## Test pyramid

| Layer            | Tooling                         | Scope                                            |
| ---------------- | ------------------------------- | ------------------------------------------------ |
| Unit             | Jest                            | Pure logic: RBAC, formatting, validation, stores |
| Component        | Jest + RTL                      | UI behavior & RBAC gating                        |
| Accessibility    | jest-axe + @axe-core/playwright | No serious/critical violations                   |
| End-to-end       | Playwright                      | Auth, navigation, ticket creation, RBAC UI       |
| Visual/reference | Playwright screenshots          | `docs/screenshots/*` for README                  |

## Commands

```bash
npm test            # Jest unit + component + a11y
npm run test:watch  # watch mode
npm run coverage    # coverage report (thresholds enforced)
npm run e2e         # Playwright e2e + axe (auto-starts prod server on :3100)
npm run e2e:ui      # Playwright UI mode
npm run screenshots # regenerate docs/screenshots
```

## What's covered

### Unit (`src/lib/__tests__`, `src/stores/__tests__`)

- **RBAC** — matrix correctness, deny-by-default, `can/canAny/canAll`.
- **Formatting** — currency, file sizes, initials.
- **Validation** — login/register/ticket Zod schemas (happy + failure paths,
  password strength, matching passwords, terms acceptance).
- **Stores** — ticket create/comment/status transitions with audit events;
  invoice payment updates status + paid date.

### Component (`src/components/__tests__`)

- **StatusBadge** — label mapping + fallback.
- **`<Can>`** — shows/hides content and renders fallback per role.
- **Accessibility** — jest-axe on Button, PageHeader, StatCard.

### End-to-end (`e2e/`) — 89 tests across every module

- **auth.spec** — redirect when unauthenticated, generic invalid-credential
  error, password show/hide toggle, account lockout after repeated failures,
  sign-in for all four demo roles, sign-out, registration (validation +
  success), forgot-password confirmation.
- **dashboard.spec** — KPI widgets, core panels, onboarding checklist dismiss,
  quick-action + project navigation.
- **projects.spec** — list, search, status filter, detail + milestones,
  breadcrumb back.
- **tickets.spec** — list + SLA overdue indicator, search + status filter, CSV
  export, create-with-attachment, agent comment/assign/resolve + CSAT rating,
  RBAC (clients see no agent actions).
- **documents.spec** — category filter, search, version-history dialog,
  download, upload (manager) vs. hidden for clients, row-level access.
- **invoices.spec** — summary, detail dialog with line items, receipt download,
  CSV export, pay-a-pending-invoice flow.
- **messages.spec** — list/open thread, reply, start a new conversation.
- **notifications.spec** — type + unread-only filters, dismiss one, clear all,
  mark all read.
- **profile.spec** — identity + last sign-in, save info, avatar upload.
- **settings.spec** — 2FA setup + recovery codes, change password
  (reject/accept), data export, sign-out-everywhere, payment methods
  add/default/remove, auto-pay, theme + text-size, localization (locale/
  timezone reformatting the live preview).
- **help-center.spec** — FAQ search, accordion expand, support shortcuts.
- **activity-log.spec** — client self-scope vs. manager org-wide + CSV export +
  type filter.
- **showcase.spec** — all eight industry adaptations render.
- **shell.spec** — command palette (Ctrl+K + header button), keyboard-shortcuts
  dialog (`?`), help menu, theme toggle, role-switcher RBAC.
- **navigation.spec** — traverse primary modules; create a ticket end-to-end.
- **rbac.spec** — client vs. manager activity-log scoping.
- **accessibility.spec** — axe scans (no serious/critical) on all public + 15
  portal routes.
- **screenshots.spec** — reference captures (light + dark).

## Configuration

- `jest.config.ts` uses `next/jest`, `jsdom`, `@/…` path mapping, and coverage
  thresholds (40% floor to keep the gate meaningful without being brittle for a
  starter — raise as the app grows).
- `jest.setup.ts` extends `jest-axe` matchers and stubs `matchMedia` /
  `ResizeObserver` for Radix/Recharts.
- `playwright.config.ts` runs Chromium against a production build on a
  **dedicated port (3100)** so e2e never collides with a dev server on `:3000`.

## CI recommendation

```yaml
# .github/workflows/ci.yml (suggested)
# - npm ci
# - npm run typecheck
# - npm run lint
# - npm test -- --coverage
# - npm run build
# - npx playwright install --with-deps chromium && npm run e2e
```

## Coverage note

Coverage focuses on logic-bearing modules (`lib`, `stores`, `hooks`,
`components`). Presentational pages are exercised via Playwright rather than
snapshot tests to avoid brittleness.
