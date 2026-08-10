"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Client-side route guard for the portal. Redirects unauthenticated users to
 * the login page once the persisted store has hydrated.
 *
 * SECURITY NOTE: Client guards are a UX convenience only. In production, gate
 * protected routes in middleware / server components using the session cookie
 * so unauthenticated users never receive protected markup. See
 * docs/security-implementation.md → "Protected Routes".
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  React.useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4" aria-hidden="true">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <span className="sr-only">Loading your portal…</span>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
