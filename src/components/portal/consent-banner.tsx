"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";

import { useSettingsStore } from "@/stores/settings-store";
import { Button } from "@/components/ui/button";

/**
 * Lightweight privacy/consent notice. Acknowledgement is persisted so it does
 * not reappear. Positioned bottom-right so it never overlaps primary
 * navigation or content controls.
 */
export function ConsentBanner() {
  const acknowledged = useSettingsStore((s) => s.consentAcknowledged);
  const update = useSettingsStore((s) => s.update);

  if (acknowledged) return null;

  return (
    <div
      role="region"
      aria-label="Privacy notice"
      className="bg-card fixed right-4 bottom-4 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-lg border p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <span className="bg-muted text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
          <Cookie className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium">Your privacy</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            This demo stores only your session and preferences locally in your
            browser. See the{" "}
            <Link href="/help-center" className="text-primary underline">
              privacy notice
            </Link>
            .
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              onClick={() => update({ consentAcknowledged: true })}
            >
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
