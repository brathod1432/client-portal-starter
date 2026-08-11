"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  FileText,
  LifeBuoy,
  MessageSquare,
  Receipt,
  FolderKanban,
  Settings as SettingsIcon,
  X,
  Trash2,
} from "lucide-react";

import type { NotificationType } from "@/lib/types";
import { useNotificationStore } from "@/stores/notification-store";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
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

const icons: Record<NotificationType, typeof Bell> = {
  ticket: LifeBuoy,
  invoice: Receipt,
  document: FileText,
  message: MessageSquare,
  project: FolderKanban,
  system: SettingsIcon,
};

export default function NotificationsPage() {
  const items = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const dismiss = useNotificationStore((s) => s.dismiss);
  const clearAll = useNotificationStore((s) => s.clearAll);
  const unread = items.filter((n) => !n.read).length;

  const [type, setType] = React.useState<NotificationType | "all">("all");
  const [unreadOnly, setUnreadOnly] = React.useState(false);

  const filtered = items.filter((n) => {
    const matchesType = type === "all" || n.type === type;
    const matchesUnread = !unreadOnly || !n.read;
    return matchesType && matchesUnread;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread` : "You're all caught up."}
        actions={
          items.length ? (
            <>
              {unread ? (
                <Button variant="outline" onClick={markAllRead}>
                  <Check /> Mark all read
                </Button>
              ) : null}
              <Button variant="ghost" onClick={clearAll}>
                <Trash2 /> Clear all
              </Button>
            </>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={type}
          onValueChange={(v) => setType(v as NotificationType | "all")}
        >
          <SelectTrigger className="w-44" aria-label="Filter by type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="ticket">Tickets</SelectItem>
            <SelectItem value="invoice">Invoices</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="message">Messages</SelectItem>
            <SelectItem value="project">Projects</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={unreadOnly ? "default" : "outline"}
          size="sm"
          aria-pressed={unreadOnly}
          onClick={() => setUnreadOnly((v) => !v)}
        >
          Unread only
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={
            items.length === 0
              ? "You're all caught up"
              : "No notifications match your filters"
          }
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const Icon = icons[n.type];
            // Stretched-link pattern: the clickable overlay and the dismiss
            // button are siblings (never nested interactives).
            return (
              <Card
                key={n.id}
                className={cn(
                  "focus-within:ring-ring relative transition-colors focus-within:ring-2",
                  !n.read && "border-primary/30 bg-primary/[0.03]",
                )}
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <span className="bg-muted text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{n.title}</p>
                      {!n.read ? (
                        <span className="bg-primary h-2 w-2 shrink-0 rounded-full" />
                      ) : null}
                    </div>
                    <p className="text-muted-foreground text-sm">{n.body}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatRelativeTime(n.timestamp)}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Dismiss notification"
                    onClick={() => dismiss(n.id)}
                    className="text-muted-foreground hover:text-foreground focus-visible:ring-ring relative z-10 -mt-1 -mr-1 rounded p-1 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </CardContent>

                {/* Full-card clickable overlay (marks read / navigates) */}
                {n.href ? (
                  <Link
                    href={n.href}
                    onClick={() => markRead(n.id)}
                    aria-label={n.title}
                    className="absolute inset-0 rounded-xl focus:outline-none"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    aria-label={n.title}
                    className="absolute inset-0 rounded-xl focus:outline-none"
                  />
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
