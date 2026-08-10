"use client";

import * as React from "react";
import {
  FileDown,
  LogIn,
  LogOut,
  UserCog,
  Download,
  Upload,
  Plus,
  RefreshCw,
  MessageSquare,
  Settings as SettingsIcon,
  Eye,
  History,
} from "lucide-react";

import type { ActivityAction } from "@/lib/types";
import { useActivityStore } from "@/stores/activity-store";
import { useAuthStore } from "@/stores/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { downloadCsv } from "@/lib/download";
import { formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const actionIcons: Record<ActivityAction, typeof LogIn> = {
  login: LogIn,
  logout: LogOut,
  profile_update: UserCog,
  document_download: Download,
  document_upload: Upload,
  ticket_create: Plus,
  ticket_update: RefreshCw,
  message_sent: MessageSquare,
  settings_update: SettingsIcon,
  invoice_view: Eye,
};

const actionLabels: Record<ActivityAction, string> = {
  login: "Signed in",
  logout: "Signed out",
  profile_update: "Updated profile",
  document_download: "Downloaded document",
  document_upload: "Uploaded document",
  ticket_create: "Created ticket",
  ticket_update: "Updated ticket",
  message_sent: "Sent message",
  settings_update: "Updated settings",
  invoice_view: "Viewed invoice",
};

export default function ActivityLogPage() {
  const events = useActivityStore((s) => s.events);
  const user = useAuthStore((s) => s.user);
  const { can } = usePermissions();
  const [filter, setFilter] = React.useState<ActivityAction | "all">("all");
  const canViewAll = can("activity:view:all");

  // Clients only see their own events; managers/admins can see everyone's.
  const scoped = canViewAll
    ? events
    : events.filter((e) => e.actor === user?.name);

  const filtered =
    filter === "all" ? scoped : scoped.filter((e) => e.action === filter);

  function exportCsv() {
    downloadCsv(
      filtered.map((e) => ({
        timestamp: e.timestamp,
        actor: e.actor,
        action: e.action,
        target: e.target,
        ip: e.ip,
        device: e.device,
      })),
      "activity-log.csv",
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity log"
        description={
          canViewAll
            ? "Organization-wide audit trail of security-relevant events."
            : "A record of actions taken on your account."
        }
        actions={
          <Button variant="outline" onClick={exportCsv}>
            <FileDown /> Export CSV
          </Button>
        }
      />

      <div className="max-w-xs">
        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as ActivityAction | "all")}
        >
          <SelectTrigger aria-label="Filter activity by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All activity</SelectItem>
            {(Object.keys(actionLabels) as ActivityAction[]).map((a) => (
              <SelectItem key={a} value={a}>
                {actionLabels[a]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={History} title="No activity to show" />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ol className="divide-y">
              {filtered.map((e) => {
                const Icon = actionIcons[e.action];
                return (
                  <li key={e.id} className="flex items-start gap-3 p-4">
                    <span className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{e.actor}</span>{" "}
                        {actionLabels[e.action].toLowerCase()}{" "}
                        <span className="text-muted-foreground">
                          — {e.target}
                        </span>
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {formatDateTime(e.timestamp)} · {e.device} · {e.ip}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
