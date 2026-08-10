"use client";

import * as React from "react";

import { AuthGuard } from "@/components/portal/auth-guard";
import { Brand } from "@/components/portal/brand";
import { SidebarNav } from "@/components/portal/sidebar-nav";
import { Topbar } from "@/components/portal/topbar";
import { CommandPalette } from "@/components/portal/command-palette";
import { IdleTimeout } from "@/components/portal/idle-timeout";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PortalShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <CommandPalette />
      <IdleTimeout />
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="bg-sidebar sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r lg:flex">
          <div className="flex h-16 items-center border-b px-6">
            <Brand />
          </div>
          <ScrollArea className="flex-1">
            <SidebarNav />
          </ScrollArea>
          <div className="text-muted-foreground border-t px-4 py-3 text-xs">
            <p>Client Portal Starter</p>
            <p className="text-[11px]">v0.1.0 · demo data</p>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8"
          >
            <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
