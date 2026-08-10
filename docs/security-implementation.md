# Security Implementation

> Phase 13 deliverable. What the starter implements today, and the exact
> production design for each control. The starter is a **client-only mock**;
> items marked _Production_ describe the required server-side implementation.

## Session management design

- **Today (demo):** a mock user is stored via Zustand `persist` in
  `localStorage` so the demo survives refreshes. An **idle timeout**
  (`IdleTimeout`, 15 min) proactively signs users out.
- **Production:** issue an opaque session on login, stored in an **httpOnly,
  Secure, SameSite=Lax/Strict cookie**. Never store tokens in JS-readable
  storage (XSS exfiltration risk). Enforce absolute + idle expiry server-side;
  rotate on privilege change; support server-side revocation ("active
  sessions"). The Settings → Security screen models device/session management
  and 2FA state.

## Authentication flow

- **Today:** `useAuthStore.login()` validates credentials against demo users
  and returns a **generic error** ("Invalid email or password") to prevent user
  enumeration. Forgot-password always shows the same confirmation for the same
  reason.
- **Production:** verify credentials against hashed passwords (argon2id/bcrypt),
  add MFA (TOTP/passkeys), rate-limit and lock out after repeated failures, and
  send signed, short-lived password-reset links.

## Authorization layer

- Centralized RBAC (`src/lib/rbac.ts`), deny-by-default. UI consumes it via
  `<Can>` / `usePermissions`; navigation is permission-filtered. See
  [rbac.md](./rbac.md).
- **Production:** enforce the identical matrix in middleware and every handler,
  plus row-level checks so users only touch their own data.

## Protected routes

- **Today:** `AuthGuard` redirects unauthenticated users to `/login` after the
  persisted store hydrates.
- **Production:** gate `(portal)` routes in `middleware.ts` / server components
  using the session cookie, so protected markup is never sent to anonymous users.

## Input validation

- Shared **Zod** schemas (`src/lib/validations.ts`) validate every form via
  React Hook Form. Reuse the same schemas on the server to validate at the trust
  boundary. Public env vars are validated by `src/lib/env.ts`.

## Output encoding (XSS prevention)

- React escapes interpolated content by default. The app uses **no
  `dangerouslySetInnerHTML`**. A **Content-Security-Policy** provides
  defense-in-depth. For any future rich text, sanitize server-side (e.g.
  DOMPurify) and render through a vetted renderer.

## CSRF prevention strategy

- The mock performs no cross-site state-changing server requests.
- **Production:** use `SameSite` cookies plus per-session CSRF tokens
  (double-submit or the framework's built-in protection) on all mutating
  requests; require `POST/PUT/PATCH/DELETE` for state changes.

## Security headers

Set for every response in `next.config.ts`:

| Header                    | Value (summary)                                                                 | Purpose                                    |
| ------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------ |
| Content-Security-Policy   | restrictive `default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'` | Mitigate XSS/data injection & clickjacking |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload`                                  | Force HTTPS                                |
| X-Frame-Options           | `DENY`                                                                          | Clickjacking                               |
| X-Content-Type-Options    | `nosniff`                                                                       | MIME sniffing                              |
| Referrer-Policy           | `strict-origin-when-cross-origin`                                               | Referrer leakage                           |
| Permissions-Policy        | camera/mic/geo/topics disabled                                                  | Reduce attack surface                      |
| `poweredByHeader: false`  | —                                                                               | Avoid tech fingerprinting                  |

> The CSP allows `'unsafe-inline'`/`'unsafe-eval'` for scripts to accommodate
> the framework's dev/runtime needs. For a strict CSP, adopt **nonces** via
> middleware and remove the unsafe directives.

## Rate limiting strategy

- **Production:** rate-limit authentication and mutation endpoints (e.g. token
  bucket in Redis / Upstash, or a WAF/edge rule). Apply stricter limits to
  login, password reset and payment endpoints; return `429` with `Retry-After`.

## Secure file upload strategy

The Documents/Tickets upload UI is a modeled placeholder. Production uploads:

1. Authorize the user + target (RBAC + row-level).
2. Validate **type** (allow-list, magic-byte sniffing), **size**, and file name.
3. Upload to object storage via **short-lived signed URLs**; never trust
   client-provided content types.
4. **Virus/malware scan** before the file becomes downloadable.
5. Serve downloads through signed, expiring URLs; log every access to the audit
   trail.

## Secrets & configuration

- No secrets in client code. Only `NEXT_PUBLIC_*` values reach the browser and
  are validated by `src/lib/env.ts`. Server secrets belong in server-only env
  and a secrets manager (see `.env.example`).

## Audit trail

See [Phase 14 / activity log](./observability.md#audit-trail). Every
security-relevant action (login, logout, profile update, document
download/upload, ticket create/update, message sent, settings update, invoice
view/payment) is recorded via `useActivityStore.log()`.

## Checklist mapped to OWASP ASVS themes

- [x] Central authorization, deny-by-default
- [x] Input validation (shared schemas)
- [x] Output encoding (React default; no raw HTML)
- [x] Security headers / CSP / HSTS
- [x] Session hygiene (idle timeout; documented cookie model)
- [x] No secrets in client; env validation
- [x] Audit logging of sensitive actions
- [ ] Server enforcement of authZ/authN _(production)_
- [ ] CSRF tokens, rate limiting, MFA, AV scanning _(production)_
