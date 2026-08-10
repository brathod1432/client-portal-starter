"use client";

import { UserCog } from "lucide-react";

import type { Role } from "@/lib/types";
import { ROLE_LABELS } from "@/lib/rbac";
import { useAuthStore } from "@/stores/auth-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const ROLES: Role[] = ["client", "agent", "manager", "admin"];

/**
 * DEMO-ONLY control. Lets reviewers instantly switch roles to see how RBAC
 * changes the UI. This has no place in production — role changes must be
 * server-authorized. Hidden behind the `DEMO` label for clarity.
 */
export function RoleSwitcher() {
  const role = useAuthStore((s) => s.user?.role);
  const loginAs = useAuthStore((s) => s.loginAs);

  if (!role) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hidden gap-2 lg:flex">
          <UserCog className="h-4 w-4" />
          <span className="text-xs">Demo role: {ROLE_LABELS[role]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch demo role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={role}
          onValueChange={(v) => loginAs(v as Role)}
        >
          {ROLES.map((r) => (
            <DropdownMenuRadioItem key={r} value={r}>
              {ROLE_LABELS[r]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
