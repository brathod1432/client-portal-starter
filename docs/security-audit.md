# Security Audit

> Phase 24 deliverable. Findings from a self-review of the codebase. Because the
> starter is a **client-only mock**, several findings are inherent to that scope
> and are resolved by the documented production controls, not code defects.

## Method

Reviewed dependencies, authentication/authorization design, routing, input
handling, form validation, session security, configuration and error handling.
Tooling: `npm audit` (0 vulnerabilities), ESLint, TypeScript strict, jest-axe,
Playwright + axe.

## Findings

| #   | Finding                                                | Severity      | Impact                                                       | Recommendation                                                     | Status                 |
| --- | ------------------------------------------------------ | ------------- | ------------------------------------------------------------ | ------------------------------------------------------------------ | ---------------------- |
| 1   | Auth is mock; session stored in `localStorage`         | High (prod)   | Client-only; tokens would be XSS-exfiltrable if reused as-is | Replace with server sessions in httpOnly cookies before production | By design (documented) |
| 2   | Authorization enforced client-side only                | High (prod)   | Client checks are bypassable                                 | Enforce RBAC + row-level in middleware/handlers                    | By design (documented) |
| 3   | Route protection via client `AuthGuard`                | Medium (prod) | Protected markup could reach anon users                      | Gate `(portal)` in `middleware.ts`/server                          | By design (documented) |
| 4   | CSP allows `'unsafe-inline'`/`'unsafe-eval'` (scripts) | Medium        | Weakens XSS defense-in-depth                                 | Adopt nonce-based CSP; drop unsafe directives                      | Open (hardening)       |
| 5   | No CSRF tokens                                         | Low (mock)    | No server mutations today                                    | Add SameSite cookies + CSRF tokens with backend                    | By design (documented) |
| 6   | No rate limiting / lockout                             | Medium (prod) | Brute-force/DoS on real auth                                 | Add rate limiting + lockout at the edge/handler                    | By design (documented) |
| 7   | File upload is a placeholder                           | Medium (prod) | Unvalidated uploads are dangerous                            | Type/size validation, signed URLs, AV scan                         | By design (documented) |
| 8   | Bleeding-edge deps (Next 16/React 19/Tailwind v4)      | Low           | Newer majors change faster                                   | Pin versions (done); monitor advisories                            | Accepted               |
| 9   | Bundled dev indicator/source maps in dev               | Info          | Dev only                                                     | Ensure `NODE_ENV=production` builds for release                    | N/A                    |
| 10  | Audit `ip`/`device` are client placeholders            | Low           | Not authoritative                                            | Derive server-side from request                                    | By design (documented) |

## Strengths observed

- Central, deny-by-default RBAC with tests.
- Strong HTTP security headers (CSP, HSTS, frame-deny, nosniff, permissions).
- Shared Zod validation; `aria-invalid`/`role="alert"` on errors.
- No `dangerouslySetInnerHTML`; React output encoding throughout.
- Generic auth errors (anti-enumeration); anti-enumeration reset flow.
- Idle session timeout; no secrets in client; validated public env.
- Audit trail of security-relevant actions; per-role data scoping.
- 0 `npm audit` vulnerabilities; clean typecheck & lint.

## Priority remediation (for production)

1. Server auth (cookies, SSO/MFA, hashing) + server RBAC + route middleware.
2. CSRF tokens, rate limiting/lockout.
3. Secure file pipeline (validation, signed URLs, AV).
4. Nonce-based CSP; re-review all headers.
5. CI security gates: `npm audit`, SAST/CodeQL, secret scanning, Dependabot.
