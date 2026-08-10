<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Client Portal Starter — Contributor Notes

## Verify changes with

- `npm run typecheck` — strict TS, must be 0 errors
- `npm run lint` — ESLint (warnings ok, 0 errors)
- `npm test` — Jest unit/component/a11y
- `npm run build` — production build must pass
- `npm run e2e` — Playwright (starts prod server on port 3100)

## Conventions

- Authorization is centralized in `src/lib/rbac.ts`; gate UI with `<Can>` /
  `usePermissions`. Never invent per-component permission logic.
- Validation lives in `src/lib/validations.ts` (Zod) and is shared with forms.
- Mock/demo data is in `src/lib/mock/*`; mutable session state in `src/stores/*`.
  This is the seam to a real backend — keep component contracts stable.
- Design tokens are in `src/app/globals.css` (OKLCH). Never hard-code colors.
- Keep accessibility intact: labeled controls, visible focus, semantic HTML.

## Environment notes

- On Windows PowerShell, invoke `npm.cmd` / `npx.cmd` if `npm.ps1` is blocked.
- E2E uses port 3100 to avoid colliding with a dev server on 3000.
