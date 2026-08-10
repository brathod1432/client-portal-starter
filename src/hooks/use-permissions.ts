"use client";

import { can, canAll, canAny, type Permission } from "@/lib/rbac";
import { useAuthStore } from "@/stores/auth-store";

/**
 * Convenience hook that binds the RBAC helpers to the current user's role.
 * Use for UI visibility only — real enforcement must also happen server-side.
 */
export function usePermissions() {
  const role = useAuthStore((s) => s.user?.role);

  return {
    role,
    can: (permission: Permission) => can(role, permission),
    canAny: (permissions: Permission[]) => canAny(role, permissions),
    canAll: (permissions: Permission[]) => canAll(role, permissions),
  };
}
