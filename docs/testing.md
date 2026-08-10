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

### End-to-end (`e2e/`)

- **auth.spec** — redirect when unauthenticated, invalid-credential error,
  demo sign-in, sign-out.
- **navigation.spec** — traverse primary modules; create a ticket end-to-end.
- **rbac.spec** — client vs. manager activity-log scoping.
- **accessibility.spec** — axe scans on key pages.
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
