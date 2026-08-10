"use client";

import * as React from "react";

import type { Permission } from "@/lib/rbac";
import { usePermissions } from "@/hooks/use-permissions";

interface CanProps {
  /** Require this single permission. */
  permission?: Permission;
  /** Require ANY of these permissions. */
  any?: Permission[];
  /** Require ALL of these permissions. */
  all?: Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Declarative permission gate for UI. Renders children only when the current
 * user's role satisfies the requested permission(s).
 */
export function Can({
  permission,
  any,
  all,
  children,
  fallback = null,
}: CanProps) {
  const { can, canAny, canAll } = usePermissions();

  let allowed = true;
  if (permission) allowed = allowed && can(permission);
  if (any) allowed = allowed && canAny(any);
  if (all) allowed = allowed && canAll(all);

  return <>{allowed ? children : fallback}</>;
}
