"use client";

import * as React from "react";
import { WifiOff } from "lucide-react";

/**
 * Network status indicator. Shows a fixed banner while the browser is offline
 * so users understand their actions may not sync. Pairs with the PWA manifest.
 */
export function OfflineBanner() {
  const [offline, setOffline] = React.useState(false);

  React.useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="bg-warning text-warning-foreground fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-2 py-1.5 text-center text-xs font-medium"
    >
      <WifiOff className="h-3.5 w-3.5" />
      You&apos;re offline — changes will sync when your connection returns.
    </div>
  );
}
