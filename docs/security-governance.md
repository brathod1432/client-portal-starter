# Security Governance — Dependency Review

> Phase 3 deliverable. Every dependency is evaluated before adoption for
> popularity, maintenance, known vulnerabilities, advisories and bundle impact.
> `npm audit` reports **0 vulnerabilities** at time of writing.

## Governance policy

1. Prefer widely-adopted, actively-maintained packages with permissive licenses
   (MIT/ISC/Apache-2.0).
2. Avoid brand-new/pre-release versions of unproven packages. (We caught and
   reverted an accidental `@tanstack/react-table@9` pre-release to stable `v8`.)
3. Keep the runtime surface small; reject packages that duplicate capability.
4. No `postinstall` scripts from untrusted packages; review transitive trees.
5. Re-run `npm audit` on every dependency change; keep the lockfile committed.

## Approved dependencies (runtime)

| Package                  | Purpose                | License    | Adoption / Maintenance    | Risk |
| ------------------------ | ---------------------- | ---------- | ------------------------- | ---- |
| next                     | Framework              | MIT        | Vast; actively maintained | Low  |
| react / react-dom        | UI runtime             | MIT        | Ubiquitous                | Low  |
| @radix-ui/*              | Accessible primitives  | MIT        | Very high; active         | Low  |
| tailwindcss              | Styling (build-time)   | MIT        | Very high; active         | Low  |
| tw-animate-css           | Tailwind v4 animations | MIT        | Growing; active           | Low  |
| class-variance-authority | Variant styling        | Apache-2.0 | High                      | Low  |
| clsx / tailwind-merge    | Class utilities        | MIT        | Very high                 | Low  |
| lucide-react             | Icons                  | ISC        | Very high; active         | Low  |
| zustand                  | State management       | MIT        | Very high; active         | Low  |
| @tanstack/react-query    | Server-state (ready)   | MIT        | Very high; active         | Low  |
| @tanstack/react-table    | Tables                 | MIT        | Very high; active         | Low  |
| recharts                 | Charts                 | MIT        | Very high; active         | Low  |
| zod                      | Validation             | MIT        | Very high; active         | Low  |
| react-hook-form          | Forms                  | MIT        | Very high; active         | Low  |
| @hookform/resolvers      | RHF+Zod bridge         | MIT        | High                      | Low  |
| next-themes              | Theme switching        | MIT        | High; active              | Low  |
| sonner                   | Toasts                 | MIT        | High; active              | Low  |
| date-fns                 | Dates (available)      | MIT        | Very high                 | Low  |

## Approved dependencies (dev/test)

| Package                                            | Purpose               | License          | Risk |
| -------------------------------------------------- | --------------------- | ---------------- | ---- |
| typescript, @types/*                               | Types                 | Apache-2.0 / MIT | Low  |
| eslint, eslint-config-next, eslint-config-prettier | Linting               | MIT              | Low  |
| prettier, prettier-plugin-tailwindcss              | Formatting            | MIT              | Low  |
| jest, jest-environment-jsdom                       | Unit test runner      | MIT              | Low  |
| @testing-library/*                                 | Component testing     | MIT              | Low  |
| jest-axe, @axe-core/playwright                     | Accessibility testing | MPL-2.0          | Low  |
| @playwright/test                                   | E2E / screenshots     | Apache-2.0       | Low  |
| husky, lint-staged                                 | Git hooks             | MIT              | Low  |

## Rejected / avoided

| Package                                   | Reason                                                                 |
| ----------------------------------------- | ---------------------------------------------------------------------- |
| `@tanstack/react-table@9.x` (pre-release) | Unstable, renamed APIs; reverted to stable `v8`.                       |
| tremor, flowbite                          | Overlap with shadcn + Recharts; extra bundle & second design language. |
| Heavy animation libraries                 | Performance & `prefers-reduced-motion` concerns.                       |
| Moment.js                                 | Large, legacy; use `Intl` / `date-fns`.                                |

## Risk ratings key

- **Low** — permissive license, high adoption, active maintenance, no known
  advisories, modest bundle impact.
- **Medium** — newer or larger; acceptable with monitoring.
- **High** — avoided.

## Notable version notes

- **Next.js 16 / React 19 / Tailwind v4** are recent majors. They are pinned
  and validated by our build, typecheck, lint and tests. Teams preferring a
  more conservative baseline can pin Next 15 / React 18 with minor changes.
- **Zod v4** — the login/register schemas use v4-compatible APIs.

## Ongoing hygiene (recommended)

- Enable Dependabot / Renovate for automated update PRs.
- Add `npm audit --omit=dev` (script: `npm run audit`) to CI.
- Add CodeQL / SAST and secret scanning in CI (see [observability.md](./observability.md)).
