/**
 * Role-Based Access Control (RBAC)
 * ------------------------------------------------------------------
 * Single source of truth for authorization in the portal. UI visibility,
 * route guards, and (in a real deployment) server-side checks should all
 * derive from these definitions. See docs/rbac.md.
 *
 * Design principles:
 *  - Deny by default: a permission not granted is denied.
 *  - Permissions are granular verbs on resources (`resource:action`).
 *  - Roles are additive bundles of permissions.
 *  - Never trust the client: these checks improve UX, but the same matrix
 *    must be enforced server-side once a backend exists.
 */

import type { Role } from "@/lib/types";

export const PERMISSIONS = [
  // Dashboard
  "dashboard:view",
  // Projects
  "projects:view",
  "projects:manage",
  // Tickets
  "tickets:view",
  "tickets:create",
  "tickets:manage",
  "tickets:assign",
  // Documents
  "documents:view",
  "documents:download",
  "documents:upload",
  "documents:manage",
  // Invoices
  "invoices:view",
  "invoices:pay",
  "invoices:manage",
  // Messages
  "messages:view",
  "messages:send",
  // Notifications
  "notifications:view",
  // Activity log
  "activity:view:self",
  "activity:view:all",
  // Users / admin
  "users:manage",
  "settings:manage:org",
  "settings:manage:self",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Role -> permission matrix. Kept explicit (rather than inherited) so the
 * grant for every role is auditable at a glance.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  client: [
    "dashboard:view",
    "projects:view",
    "tickets:view",
    "tickets:create",
    "documents:view",
    "documents:download",
    "invoices:view",
    "invoices:pay",
    "messages:view",
    "messages:send",
    "notifications:view",
    "activity:view:self",
    "settings:manage:self",
  ],
  agent: [
    "dashboard:view",
    "projects:view",
    "tickets:view",
    "tickets:create",
    "tickets:manage",
    "tickets:assign",
    "documents:view",
    "documents:download",
    "documents:upload",
    "messages:view",
    "messages:send",
    "notifications:view",
    "activity:view:self",
    "settings:manage:self",
  ],
  manager: [
    "dashboard:view",
    "projects:view",
    "projects:manage",
    "tickets:view",
    "tickets:create",
    "tickets:manage",
    "tickets:assign",
    "documents:view",
    "documents:download",
    "documents:upload",
    "documents:manage",
    "invoices:view",
    "invoices:manage",
    "messages:view",
    "messages:send",
    "notifications:view",
    "activity:view:self",
    "activity:view:all",
    "settings:manage:self",
  ],
  admin: [...PERMISSIONS],
};

export const ROLE_LABELS: Record<Role, string> = {
  client: "Client",
  agent: "Support Agent",
  manager: "Account Manager",
  admin: "Administrator",
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  client:
    "External customer. Can view their projects, raise tickets, read documents and pay invoices.",
  agent:
    "Internal support staff. Handles and assigns tickets and uploads supporting documents.",
  manager:
    "Account owner. Full operational access including project and billing management and org-wide activity.",
  admin:
    "Platform administrator. Full access including user management and organization settings.",
};

/** Returns true when the given role holds the permission. Deny by default. */
export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/** True when the role holds at least one of the permissions. */
export function canAny(
  role: Role | undefined,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => can(role, p));
}

/** True when the role holds all of the permissions. */
export function canAll(
  role: Role | undefined,
  permissions: Permission[],
): boolean {
  return permissions.every((p) => can(role, p));
}
