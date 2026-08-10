"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const IDLE_LIMIT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_MS = 60 * 1000; // warn 60s before sign-out

/**
 * Idle session timeout with a warning dialog and countdown — a common
 * enterprise/compliance requirement (PCI, HIPAA). Users can extend the session
 * or are signed out automatically. In production the authoritative timeout is
 * the session cookie's max-age enforced server-side; this provides the UX.
 */
export function IdleTimeout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const log = useActivityStore((s) => s.log);

  const [warning, setWarning] = React.useState(false);
  const [remaining, setRemaining] = React.useState(WARNING_MS / 1000);

  const idleTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdown = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const warningRef = React.useRef(false);
  const stayRef = React.useRef<() => void>(() => {});
  const logoutRef = React.useRef<() => void>(() => {});

  React.useEffect(() => {
    if (!user) return;

    const clearAll = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warnTimer.current) clearTimeout(warnTimer.current);
      if (countdown.current) clearInterval(countdown.current);
    };

    const doLogout = () => {
      clearAll();
      warningRef.current = false;
      setWarning(false);
      log("logout", user.name, "Idle timeout");
      logout();
      router.replace("/login");
      toast.info("You were signed out due to inactivity.");
    };

    const start = () => {
      clearAll();
      warningRef.current = false;
      setWarning(false);
      warnTimer.current = setTimeout(() => {
        warningRef.current = true;
        setRemaining(WARNING_MS / 1000);
        setWarning(true);
        countdown.current = setInterval(() => {
          setRemaining((r) => (r > 0 ? r - 1 : 0));
        }, 1000);
      }, IDLE_LIMIT_MS - WARNING_MS);
      idleTimer.current = setTimeout(doLogout, IDLE_LIMIT_MS);
    };

    const onActivity = () => {
      // Once the warning is shown, require an explicit choice.
      if (warningRef.current) return;
      start();
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) =>
      window.addEventListener(e, onActivity, { passive: true }),
    );
    start();

    // expose for the dialog buttons
    stayRef.current = start;
    logoutRef.current = doLogout;

    return () => {
      clearAll();
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [user, logout, router, log]);

  if (!user) return null;

  return (
    <Dialog open={warning} onOpenChange={(o) => !o && stayRef.current()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Still there?</DialogTitle>
          <DialogDescription>
            For your security you&apos;ll be signed out in{" "}
            <span className="text-foreground font-semibold">{remaining}s</span>{" "}
            due to inactivity.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => logoutRef.current()}>
            Sign out now
          </Button>
          <Button onClick={() => stayRef.current()}>Stay signed in</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
