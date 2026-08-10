"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";

const IDLE_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_MS = 60 * 1000; // warn 60s before

/**
 * Idle session timeout. Signs the user out after inactivity — a common
 * enterprise/compliance requirement (e.g. PCI, HIPAA). In production the
 * authoritative timeout is enforced by the session cookie's max-age on the
 * server; this client timer provides the UX and proactive sign-out.
 */
export function IdleTimeout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const log = useActivityStore((s) => s.log);

  React.useEffect(() => {
    if (!user) return;
    let idleTimer: ReturnType<typeof setTimeout>;
    let warnTimer: ReturnType<typeof setTimeout>;

    function reset() {
      clearTimeout(idleTimer);
      clearTimeout(warnTimer);
      warnTimer = setTimeout(() => {
        toast.warning("You'll be signed out soon due to inactivity.");
      }, IDLE_LIMIT_MS - WARNING_MS);
      idleTimer = setTimeout(() => {
        log("logout", user!.name, "Idle timeout");
        logout();
        router.replace("/login");
        toast.info("You were signed out due to inactivity.");
      }, IDLE_LIMIT_MS);
    }

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(warnTimer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [user, logout, router, log]);

  return null;
}
