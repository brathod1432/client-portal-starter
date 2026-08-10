"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/stores/auth-store";
import { useTicketStore } from "@/stores/ticket-store";
import { useInvoiceStore } from "@/stores/invoice-store";
import { useActivityStore } from "@/stores/activity-store";
import { useSettingsStore } from "@/stores/settings-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * "Download my data" — a self-service data-portability export (GDPR Art. 20 /
 * CCPA style). Produces a JSON snapshot of the signed-in user's data. In
 * production this is generated server-side from authorized queries.
 */
export function DataExportCard() {
  const user = useAuthStore((s) => s.user);
  const tickets = useTicketStore((s) => s.tickets);
  const invoices = useInvoiceStore((s) => s.invoices);
  const events = useActivityStore((s) => s.events);
  const settings = useSettingsStore();
  const log = useActivityStore((s) => s.log);

  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      profile: user,
      preferences: {
        emailNotifications: settings.emailNotifications,
        ticketUpdates: settings.ticketUpdates,
        invoiceReminders: settings.invoiceReminders,
        weeklyDigest: settings.weeklyDigest,
        productAnnouncements: settings.productAnnouncements,
        twoFactorEnabled: settings.twoFactorEnabled,
        timezone: settings.timezone,
        language: settings.language,
      },
      tickets: tickets.filter((t) => t.requester === user?.name),
      invoices,
      activity: events.filter((e) => e.actor === user?.name),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-portal-data.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    log("settings_update", user?.name ?? "You", "Data export");
    toast.success("Your data export has been downloaded");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your data</CardTitle>
        <CardDescription>
          Download a copy of your account data at any time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={exportData}>
          <Download /> Download my data (JSON)
        </Button>
      </CardContent>
    </Card>
  );
}
