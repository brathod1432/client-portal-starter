# Role-Based Access Control (RBAC)

> Phase 12 deliverable. Authorization is centralized in `src/lib/rbac.ts` and
> consumed by the UI via `<Can>` and `usePermissions`. **Deny by default.**

## Roles

| Role      | Label           | Description                                                                                            |
| --------- | --------------- | ------------------------------------------------------------------------------------------------------ |
| `client`  | Client          | External customer. Views their projects, raises tickets, reads documents, pays invoices.               |
| `agent`   | Support Agent   | Internal support. Handles/assigns tickets, uploads supporting documents.                               |
| `manager` | Account Manager | Owns the relationship. Full operational access incl. project/billing management and org-wide activity. |
| `admin`   | Administrator   | Platform admin. Everything, incl. user management and org settings.                                    |

## Permissions

Permissions are granular `resource:action` verbs. The full list lives in
`PERMISSIONS`. A permission that is not granted is denied.

## Permission matrix

| Permission           | Client | Agent | Manager | Admin |
| -------------------- | :----: | :---: | :-----: | :---: |
| dashboard:view       |   ✅   |  ✅   |   ✅    |  ✅   |
| projects:view        |   ✅   |  ✅   |   ✅    |  ✅   |
| projects:manage      |        |       |   ✅    |  ✅   |
| tickets:view         |   ✅   |  ✅   |   ✅    |  ✅   |
| tickets:create       |   ✅   |  ✅   |   ✅    |  ✅   |
| tickets:manage       |        |  ✅   |   ✅    |  ✅   |
| tickets:assign       |        |  ✅   |   ✅    |  ✅   |
| documents:view       |   ✅   |  ✅   |   ✅    |  ✅   |
| documents:download   |   ✅   |  ✅   |   ✅    |  ✅   |
| documents:upload     |        |  ✅   |   ✅    |  ✅   |
| documents:manage     |        |       |   ✅    |  ✅   |
| invoices:view        |   ✅   |       |   ✅    |  ✅   |
| invoices:pay         |   ✅   |       |         |  ✅   |
| invoices:manage      |        |       |   ✅    |  ✅   |
| messages:view        |   ✅   |  ✅   |   ✅    |  ✅   |
| messages:send        |   ✅   |  ✅   |   ✅    |  ✅   |
| notifications:view   |   ✅   |  ✅   |   ✅    |  ✅   |
| activity:view:self   |   ✅   |  ✅   |   ✅    |  ✅   |
| activity:view:all    |        |       |   ✅    |  ✅   |
| users:manage         |        |       |         |  ✅   |
| settings:manage:org  |        |       |         |  ✅   |
| settings:manage:self |   ✅   |  ✅   |   ✅    |  ✅   |

> The matrix is defined explicitly (not inherited) so each role's grants are
> auditable at a glance. `admin` is granted the full permission set.

## UI visibility rules

- **Navigation** — items declare a required `permission`; `SidebarNav` and the
  command palette filter out items the current role cannot access.
- **Actions** — buttons like _New ticket_, _Upload_, _Pay_ are wrapped in
  `<Can permission="…">` so they only render when permitted.
- **Data scoping** — the Documents center hides documents whose `accessRoles`
  exclude the current role; the Activity log shows self-only events for clients
  and org-wide events for managers/admins.

## Access control examples

```tsx
// Component gate
<Can permission="invoices:pay">
  <Button onClick={pay}>Pay now</Button>
</Can>;

// Imperative check
const { can } = usePermissions();
if (can("tickets:assign")) {
  /* show assignment control */
}

// Pure helpers (also used in tests and, in production, on the server)
import { can, canAny, canAll } from "@/lib/rbac";
can("client", "users:manage"); // false
canAny("manager", ["invoices:manage"]); // true
```

## Production enforcement (critical)

Client-side checks improve UX but are **not** a security boundary. In
production:

- Enforce the **same matrix** in middleware and every API handler.
- Derive the role from the **server session**, never from client input.
- Apply **row-level** authorization for data access (e.g. a client can only
  read their own tickets/documents/invoices).

See [security-implementation.md](./security-implementation.md).
