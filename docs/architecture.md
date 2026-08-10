# Architecture

## Overview

The Client Portal Starter is a **Next.js (App Router) + TypeScript** application
using a **client-only mock** data layer. It is structured so the mock can be
replaced by a real backend without rewriting the UI.

```
Browser
  └─ Next.js App Router (RSC + Client Components)
       ├─ Providers: ThemeProvider, TanStack Query, Tooltip, Toaster
       ├─ Route groups
       │    ├─ (auth): /login /register /forgot-password
       │    └─ (portal): guarded shell + all modules
       ├─ State (Zustand): auth, tickets, messages, invoices, documents,
       │                    notifications, activity, settings
       ├─ RBAC module: single source of truth for authorization
       └─ Mock data layer (src/lib/mock/*) ← the seam to a real API
```

## Directory layout

```
src/
├─ app/
│  ├─ (auth)/            # login, register, forgot-password + auth layout
│  ├─ (portal)/          # guarded portal shell + all module pages
│  │  ├─ dashboard/ projects/ tickets/ documents/ invoices/
│  │  ├─ messages/ notifications/ profile/ settings/
│  │  ├─ help-center/ activity-log/ showcase/
│  │  └─ layout.tsx loading.tsx
│  ├─ error.tsx not-found.tsx layout.tsx page.tsx globals.css
├─ components/
│  ├─ ui/                # shadcn-style primitives (Radix-backed)
│  ├─ portal/            # shell: sidebar, topbar, guard, command palette…
│  ├─ dashboard/         # stat cards + charts
│  ├─ shared/            # page header, data table, breadcrumbs, empty state…
│  └─ rbac/              # <Can> permission gate
├─ hooks/                # use-permissions
├─ lib/                  # rbac, types, validations, format, navigation, mock/
└─ stores/               # zustand stores
```

## Key decisions & rationale

### 1. Route groups + client guard

`(auth)` and `(portal)` separate unauthenticated and authenticated shells.
`AuthGuard` redirects unauthenticated users **client-side** for UX. In
production, the authoritative check belongs in **middleware / server components**
using the session cookie (documented in
[security-implementation.md](./security-implementation.md)).

### 2. RBAC as the single source of truth

`src/lib/rbac.ts` defines permissions, the role→permission matrix, and helpers
(`can`, `canAny`, `canAll`). UI uses the `<Can>` component and `usePermissions`
hook. Navigation is permission-filtered. The same matrix must be enforced
server-side once a backend exists.

### 3. Mock data layer as the migration seam

All demo data lives in `src/lib/mock/*` and is re-exported from
`src/lib/mock/index.ts`. Mutable stores (tickets, invoices, documents, messages)
seed from this data and model create/update flows. **To adopt a backend:**
replace store internals with TanStack Query hooks calling your API, keeping the
same component contracts.

### 4. State strategy

- **Zustand** for client/UI state and demo mutations. Auth and settings persist
  to `localStorage` (documented as demo-only; production uses httpOnly cookies).
- **TanStack Query** is provisioned in `providers.tsx` for future server state.

### 5. Validation shared across boundaries

Zod schemas in `src/lib/validations.ts` drive React Hook Form on the client and
are designed to be reused on the server so validation happens at the trust
boundary.

### 6. Design tokens

OKLCH tokens in `globals.css` with a `.dark` variant, surfaced to Tailwind via
`@theme inline`. See [design-system.md](./design-system.md).

## Data flow (example: create a ticket)

1. `/tickets/new` renders a RHF form validated by `createTicketSchema`.
2. On submit, `useTicketStore.create()` adds the ticket + an opening timeline
   event and returns it.
3. `useActivityStore.log("ticket_create", …)` records an audit event.
4. The user is routed to `/tickets/[id]`, which reads the ticket reactively.

In production, step 2 becomes a mutation to `POST /api/tickets`, step 3 is
recorded server-side, and reads use query hooks.

## Rendering & performance

- Server Components by default; Client Components where interactivity/state is
  needed.
- Charts are **dynamically imported** (`next/dynamic`, `ssr:false`) to keep the
  dashboard's initial JS small.
- Route-level code splitting is automatic per App Router segment.
- Security headers are set in `next.config.ts`.

## Extending to a backend (recommended path)

1. Add API route handlers (or a separate service) and a database (Prisma/Postgres).
2. Move auth to server-issued httpOnly session cookies; enforce RBAC in
   middleware + handlers.
3. Replace store internals with TanStack Query hooks.
4. Swap document downloads for signed URLs from object storage.
5. Integrate a payments provider server-side for invoices.

See [future-roadmap.md](./future-roadmap.md) and [deployment.md](./deployment.md).
