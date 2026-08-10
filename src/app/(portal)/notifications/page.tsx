"use client";

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
} from "lucide-react";

import type { NotificationType } from "@/lib/types";
import { useNotificationStore } from "@/stores/notification-store";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  const unread = items.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread` : "You're all caught up."}
        actions={
          unread ? (
            <Button variant="outline" onClick={markAllRead}>
              <Check /> Mark all read
            </Button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" />
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const Icon = icons[n.type];
            const body = (
              <Card
                className={cn(
                  "transition-colors",
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
                </CardContent>
              </Card>
            );

            return n.href ? (
              <Link
                key={n.id}
                href={n.href}
                onClick={() => markRead(n.id)}
                className="focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
              >
                {body}
              </Link>
            ) : (
              <button
                key={n.id}
                type="button"
                onClick={() => markRead(n.id)}
                className="focus-visible:ring-ring block w-full rounded-xl text-left focus-visible:ring-2 focus-visible:outline-none"
              >
                {body}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
