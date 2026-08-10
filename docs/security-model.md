# Security Model

> A concise threat-model view: trust boundaries, assets, threats and controls.
> Complements [security-implementation.md](./security-implementation.md).

## Assets

- **User identity & sessions** — who is signed in and as what role.
- **Customer data** — projects, tickets, documents, invoices, messages.
- **Audit trail** — record of security-relevant actions.
- **Configuration & secrets** — env, keys (server-only).

## Trust boundaries

1. **Browser ↔ app** — all user input is untrusted; validate and encode.
2. **App ↔ backend (future)** — the real authorization boundary; enforce
   authN/authZ server-side.
3. **App ↔ third parties (future)** — payments, storage, AI, email; isolate
   secrets, verify webhooks.

> In the current mock, there is no server boundary — which is exactly why the
> docs stress that client guards/RBAC are UX aids, not security.

## Roles & least privilege

Four roles (`client`, `agent`, `manager`, `admin`) with an explicit,
deny-by-default permission matrix. See [rbac.md](./rbac.md).

## Threats & controls (STRIDE-lite)

| Threat                     | Example                         | Control                                                                   |
| -------------------------- | ------------------------------- | ------------------------------------------------------------------------- |
| **Spoofing**               | Credential stuffing             | (Prod) MFA, rate limiting, lockout, hashed passwords; generic auth errors |
| **Tampering**              | Modifying another user's ticket | (Prod) server RBAC + row-level checks; validated inputs                   |
| **Repudiation**            | "I didn't download that"        | Audit trail of sensitive actions                                          |
| **Information disclosure** | Reading a doc for another role  | `accessRoles` filtering (UI today; row-level server-side in prod)         |
| **Denial of service**      | Auth endpoint flooding          | (Prod) rate limiting, WAF, caching                                        |
| **Elevation of privilege** | Client acting as admin          | Central RBAC; role from server session only (prod)                        |
| **XSS**                    | Injected script                 | React escaping, no raw HTML, strict CSP                                   |
| **Clickjacking**           | Framing the app                 | `frame-ancestors 'none'`, `X-Frame-Options: DENY`                         |
| **Session theft**          | Token exfiltration via XSS      | (Prod) httpOnly cookies (no JS-readable tokens); idle timeout             |
| **CSRF**                   | Forged state change             | (Prod) SameSite cookies + CSRF tokens                                     |

## Data classification & handling

| Class        | Examples                 | Handling                                                   |
| ------------ | ------------------------ | ---------------------------------------------------------- |
| Public       | Marketing copy           | No restriction                                             |
| Internal     | Project metadata         | Authenticated access                                       |
| Confidential | Contracts, invoices, PII | RBAC + row-level + encryption at rest (prod); audit access |
| Secret       | Keys, session secrets    | Server-only; secrets manager; never in client              |

## Compliance orientation

The controls map toward common frameworks (SOC 2, ISO 27001, GDPR): access
control, audit logging, encryption, least privilege, data-subject rights.
Implement server-side persistence and the production controls above to pursue
formal compliance.
