"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Rocket, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useTicketStore } from "@/stores/ticket-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

/**
 * First-run guidance. Nudges new users toward the actions that make the portal
 * valuable and secure. Auto-hides once complete or dismissed (persisted).
 */
export function OnboardingChecklist() {
  const user = useAuthStore((s) => s.user);
  const twoFactorEnabled = useSettingsStore((s) => s.twoFactorEnabled);
  const dismissed = useSettingsStore((s) => s.onboardingDismissed);
  const update = useSettingsStore((s) => s.update);
  const tickets = useTicketStore((s) => s.tickets);

  const hasTicket = tickets.some((t) => t.requester === user?.name);

  const steps = [
    {
      label: "Personalize your profile",
      hint: "Add a profile photo",
      done: Boolean(user?.avatarUrl),
      href: "/profile",
    },
    {
      label: "Secure your account",
      hint: "Turn on two-factor authentication",
      done: twoFactorEnabled,
      href: "/settings",
    },
    {
      label: "Raise your first ticket",
      hint: "Tell us how we can help",
      done: hasTicket,
      href: "/tickets/new",
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);

  if (dismissed || completed === steps.length) return null;

  return (
    <Card className="border-primary/20 from-primary/5 bg-gradient-to-br to-transparent">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Rocket className="h-4 w-4" />
            </span>
            <div>
              <p className="font-semibold">Get started</p>
              <p className="text-muted-foreground text-xs">
                {completed} of {steps.length} complete
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            aria-label="Dismiss getting started"
            onClick={() => update({ onboardingDismissed: true })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Progress
          value={pct}
          aria-label="Onboarding progress"
          className="mt-4 mb-4"
        />

        <ul className="grid gap-2 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.label}>
              <Link
                href={step.href}
                className={cn(
                  "focus-visible:ring-ring flex items-start gap-2 rounded-lg border p-3 transition-colors focus-visible:ring-2 focus-visible:outline-none",
                  step.done ? "bg-muted/50" : "hover:bg-accent/50",
                )}
              >
                {step.done ? (
                  <CheckCircle2 className="text-success mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <Circle className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>
                  <span
                    className={cn(
                      "block text-sm font-medium",
                      step.done && "text-muted-foreground line-through",
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {step.hint}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
