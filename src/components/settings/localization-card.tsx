"use client";

import { useSettingsStore } from "@/stores/settings-store";
import { useAuthStore } from "@/stores/auth-store";
import { useActivityStore } from "@/stores/activity-store";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-IN", label: "English (India)" },
  { value: "de-DE", label: "German" },
  { value: "fr-FR", label: "French" },
  { value: "es-ES", label: "Spanish" },
];

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Australia/Sydney",
];

/**
 * Localization preferences. These drive every date/currency formatter in the
 * app (see lib/locale.ts), so the live preview below reflects the choice.
 */
export function LocalizationCard() {
  const language = useSettingsStore((s) => s.language);
  const timezone = useSettingsStore((s) => s.timezone);
  const update = useSettingsStore((s) => s.update);
  const user = useAuthStore((s) => s.user);
  const log = useActivityStore((s) => s.log);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Localization</CardTitle>
        <CardDescription>
          Language and timezone used across dates, times and currency.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Language / region</Label>
            <Select
              value={language}
              onValueChange={(v) => {
                update({ language: v });
                log("settings_update", user?.name ?? "You", `Language: ${v}`);
              }}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.value} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={timezone}
              onValueChange={(v) => {
                update({ timezone: v });
                log("settings_update", user?.name ?? "You", `Timezone: ${v}`);
              }}
            >
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-muted/40 rounded-lg border p-3 text-sm">
          <p className="text-muted-foreground text-xs font-medium">
            Live preview
          </p>
          <p className="mt-1" data-testid="locale-preview">
            {formatDateTime("2025-08-15T14:30:00.000Z")} ·{" "}
            {formatCurrency(18400)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
