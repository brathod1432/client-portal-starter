"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { navSections } from "@/lib/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { useNotificationStore } from "@/stores/notification-store";
import { conversations } from "@/lib/mock/messages";
import { tickets } from "@/lib/mock/tickets";
import { Badge } from "@/components/ui/badge";

function useBadgeCounts() {
  const unreadNotifications = useNotificationStore(
    (s) => s.items.filter((n) => !n.read).length,
  );
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unread, 0);
  const openTickets = tickets.filter(
    (t) => t.status === "open" || t.status === "in_progress",
  ).length;

  return {
    notifications: unreadNotifications,
    messages: unreadMessages,
    tickets: openTickets,
  } as const;
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { can } = usePermissions();
  const badges = useBadgeCounts();

  return (
    <nav aria-label="Primary" className="flex flex-col gap-6 px-3 py-4">
      {navSections.map((section) => {
        const visibleItems = section.items.filter(
          (item) => !item.permission || can(item.permission),
        );
        if (visibleItems.length === 0) return null;

        return (
          <div key={section.label} className="space-y-1">
            <p className="text-muted-foreground px-3 text-xs font-medium tracking-wider uppercase">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {visibleItems.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const count = item.badge ? badges[item.badge] : 0;
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group focus-visible:ring-sidebar-ring flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
                        active
                          ? "bg-sidebar-primary/10 text-sidebar-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active
                            ? "text-sidebar-primary"
                            : "text-muted-foreground group-hover:text-sidebar-accent-foreground",
                        )}
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate">{item.title}</span>
                      {count > 0 ? (
                        <Badge
                          variant={active ? "default" : "secondary"}
                          className="h-5 min-w-5 justify-center px-1.5 text-[11px]"
                        >
                          {count}
                        </Badge>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
