# Deployment

## Build

```bash
npm ci
npm run build
npm run start   # serves the optimized production build
```

The app is a standard Next.js (App Router) build and deploys anywhere Next.js
is supported.

## Recommended targets

### Vercel (simplest)

- Import the repo; framework auto-detected.
- Set environment variables from `.env.example`.
- Security headers from `next.config.ts` are applied automatically.

### Node server / container

```dockerfile
# Dockerfile (sketch)
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm","run","start"]
```

> For the smallest image, enable `output: "standalone"` in `next.config.ts`.

### Static export

Not recommended as-is: the app relies on client interactivity and is intended to
gain server routes/middleware for production auth.

## Environment variables

Set the values from `.env.example`. Client-visible values must be prefixed
`NEXT_PUBLIC_`. Keep all secrets server-only and in a secrets manager.

## Production readiness checklist

- [ ] Replace mock auth with server sessions (httpOnly cookies) + provider/SSO.
- [ ] Add `middleware.ts` to gate `(portal)` routes server-side.
- [ ] Persist data (DB) and enforce RBAC + row-level authz server-side.
- [ ] Object storage + signed URLs + AV scanning for documents.
- [ ] Payments provider (server intents + webhook verification) for invoices.
- [ ] Rate limiting on auth/mutations; WAF.
- [ ] Error reporting + logging + tracing + health checks (see observability).
- [ ] Tighten CSP with nonces; review all headers.
- [ ] CI: typecheck, lint, test, build, e2e, `npm audit`, SAST/secret scan.
- [ ] Backups, retention and DR plan.

## CI/CD (suggested)

Run on every PR: `typecheck → lint → test (coverage) → build → e2e → audit`.
Deploy from `main` after checks pass. See [testing.md](./testing.md) for a
sample workflow.
