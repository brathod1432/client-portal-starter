"use client";

import { cn } from "@/lib/utils";

interface Check {
  label: string;
  test: (v: string) => boolean;
}

const checks: Check[] = [
  { label: "12+ characters", test: (v) => v.length >= 12 },
  {
    label: "Upper & lowercase",
    test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v),
  },
  { label: "A number", test: (v) => /[0-9]/.test(v) },
  { label: "A symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-warning",
  "bg-info",
  "bg-success",
];

/** Live password strength meter driven by the same rules as the Zod schema. */
export function PasswordStrength({ password = "" }: { password?: string }) {
  if (!password) return null;
  const passed = checks.filter((c) => c.test(password)).length;

  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < passed ? COLORS[passed] : "bg-muted",
            )}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        Strength: <span className="font-medium">{LABELS[passed]}</span>
      </p>
    </div>
  );
}
