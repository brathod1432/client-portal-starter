# Setup

## Prerequisites

- **Node.js 20+** (tested on Node 22)
- **npm 10+**

## Install

```bash
git clone https://github.com/brathod1432/client-portal-starter.git
cd client-portal-starter
npm install
```

## Environment

Copy the sample env and adjust as needed (all values are optional for the mock):

```bash
cp .env.example .env.local
```

Only `NEXT_PUBLIC_*` variables are used by the client and are validated by
`src/lib/env.ts`. The remaining entries are placeholders for when you add a
backend.

## Run the app

```bash
npm run dev       # http://localhost:3000
```

### Demo sign-in

The portal uses **mock authentication**. On `/login`, use the demo buttons to
quick-fill an account (password: `demo1234`):

| Role            | Email                     |
| --------------- | ------------------------- |
| Client          | client@acme.example       |
| Support Agent   | agent@northwind.example   |
| Account Manager | manager@northwind.example |
| Administrator   | admin@northwind.example   |

Use the **"Demo role"** switcher in the header to change roles on the fly and
see RBAC affect the UI.

## Common scripts

```bash
npm run dev          # dev server
npm run build        # production build
npm run start        # serve the production build
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run format       # prettier --write
npm test             # unit + component + a11y
npm run coverage     # coverage report
npm run e2e          # Playwright e2e + axe (uses port 3100)
npm run screenshots  # regenerate docs/screenshots
npm run audit        # npm audit (prod deps)
```

## First-run notes

- Auth/session and settings persist to `localStorage` (demo only). Clear site
  data to reset, or sign out.
- Data actions (create ticket, reply, pay invoice, upload) persist for the
  current session in memory.

## Troubleshooting

- **Port 3000 in use** — dev picks another port; e2e uses **3100** by design.
- **PowerShell blocks `npm.ps1`** — invoke `npm.cmd` / `npx.cmd`, or adjust your
  execution policy.
- **Playwright browser missing** — run `npx playwright install chromium`.
