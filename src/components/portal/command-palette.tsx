"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, CornerDownLeft, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { navSections } from "@/lib/navigation";
import { usePermissions } from "@/hooks/use-permissions";
import { projects } from "@/lib/mock/projects";
import { useTicketStore } from "@/stores/ticket-store";
import { useDocumentStore } from "@/stores/document-store";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface Command {
  id: string;
  label: string;
  group: string;
  href: string;
  icon?: LucideIcon;
  keywords?: string;
}

/**
 * Global command palette (Cmd/Ctrl+K). Searches navigation, projects, tickets
 * and documents, respecting the user's permissions. A real deployment would
 * back this with a search API / full-text index.
 */
export function CommandPalette() {
  const router = useRouter();
  const { can } = usePermissions();
  const tickets = useTicketStore((s) => s.tickets);
  const documents = useDocumentStore((s) => s.documents);

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const commands = React.useMemo<Command[]>(() => {
    const navCommands: Command[] = navSections.flatMap((section) =>
      section.items
        .filter((item) => !item.permission || can(item.permission))
        .map((item) => ({
          id: `nav-${item.href}`,
          label: item.title,
          group: "Navigation",
          href: item.href,
          icon: item.icon,
        })),
    );
    const projectCommands: Command[] = can("projects:view")
      ? projects.map((p) => ({
          id: `prj-${p.id}`,
          label: p.name,
          group: "Projects",
          href: `/projects/${p.id}`,
          keywords: p.client,
        }))
      : [];
    const ticketCommands: Command[] = can("tickets:view")
      ? tickets.slice(0, 20).map((t) => ({
          id: `tkt-${t.id}`,
          label: `${t.reference} · ${t.subject}`,
          group: "Tickets",
          href: `/tickets/${t.id}`,
        }))
      : [];
    const docCommands: Command[] = can("documents:view")
      ? documents.map((d) => ({
          id: `doc-${d.id}`,
          label: d.name,
          group: "Documents",
          href: "/documents",
        }))
      : [];
    return [
      ...navCommands,
      ...projectCommands,
      ...ticketCommands,
      ...docCommands,
    ];
  }, [can, tickets, documents]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.filter((c) => c.group === "Navigation");
    return commands
      .filter((c) => `${c.label} ${c.keywords ?? ""}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [commands, query]);

  const grouped = React.useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filtered.forEach((c) => {
      (groups[c.group] ||= []).push(c);
    });
    return groups;
  }, [filtered]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && filtered[active]) {
      e.preventDefault();
      go(filtered[active].href);
    }
  }

  let flatIndex = -1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Command palette</DialogTitle>
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search or jump to…"
            aria-label="Search commands"
            className="placeholder:text-muted-foreground h-12 w-full bg-transparent text-sm outline-none"
          />
          <kbd className="bg-muted text-muted-foreground hidden rounded border px-1.5 py-0.5 text-[10px] sm:inline">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              No results for “{query}”.
            </p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="text-muted-foreground px-2 py-1 text-xs font-medium">
                  {group}
                </p>
                {items.map((c) => {
                  flatIndex += 1;
                  const idx = flatIndex;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => go(c.href)}
                      onMouseEnter={() => setActive(idx)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm",
                        idx === active
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50",
                      )}
                    >
                      {Icon ? (
                        <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
                      ) : (
                        <span className="w-4" />
                      )}
                      <span className="truncate">{c.label}</span>
                      {idx === active ? (
                        <CornerDownLeft className="text-muted-foreground ml-auto h-3.5 w-3.5" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
