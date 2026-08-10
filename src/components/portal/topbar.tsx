"use client";

import * as React from "react";
import { Menu, Search } from "lucide-react";

import { Brand } from "@/components/portal/brand";
import { SidebarNav } from "@/components/portal/sidebar-nav";
import { UserMenu } from "@/components/portal/user-menu";
import { NotificationsMenu } from "@/components/portal/notifications-menu";
import { RoleSwitcher } from "@/components/portal/role-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Topbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [modKey, setModKey] = React.useState("Ctrl ");

  React.useEffect(() => {
    if (
      typeof navigator !== "undefined" &&
      /Mac|iPod|iPhone|iPad/.test(navigator.platform)
    ) {
      setModKey("⌘");
    }
  }, []);

  function openCommandPalette() {
    // The CommandPalette listens for Ctrl/Cmd+K globally.
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
    );
  }

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 items-center gap-2 border-b px-4 backdrop-blur">
      {/* Mobile nav trigger */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b px-4 py-4 text-left">
            <SheetTitle asChild>
              <Brand />
            </SheetTitle>
          </SheetHeader>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 items-center gap-3">
        <button
          type="button"
          onClick={openCommandPalette}
          className="bg-background text-muted-foreground hover:bg-accent/50 focus-visible:ring-ring relative hidden h-9 w-full max-w-md items-center gap-2 rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none md:flex"
          aria-label="Search the portal"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Search projects, tickets, documents…</span>
          <kbd className="bg-muted ml-auto rounded border px-1.5 py-0.5 text-[10px] font-medium">
            {modKey}K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <RoleSwitcher />
        <ThemeToggle />
        <NotificationsMenu />
        <UserMenu />
      </div>
    </header>
  );
}
