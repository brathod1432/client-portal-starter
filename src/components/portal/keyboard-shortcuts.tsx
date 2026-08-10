"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const shortcuts: { keys: string[]; label: string }[] = [
  { keys: ["Ctrl/⌘", "K"], label: "Open command palette / search" },
  { keys: ["?"], label: "Show this shortcuts help" },
  { keys: ["Esc"], label: "Close dialogs and menus" },
  { keys: ["Tab"], label: "Move focus to the next control" },
  { keys: ["Shift", "Tab"], label: "Move focus to the previous control" },
  { keys: ["Enter"], label: "Activate the focused button or link" },
];

/**
 * Global keyboard-shortcuts help. Opens on "?" (unless typing in a field).
 * Improves discoverability of the command palette and keyboard navigation.
 */
export function KeyboardShortcuts() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "?") return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable);
      if (typing) return;
      e.preventDefault();
      setOpen((o) => !o);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
          <DialogDescription>
            Work faster with the keyboard. Press{" "}
            <kbd className="bg-muted rounded border px-1">?</kbd> anytime.
          </DialogDescription>
        </DialogHeader>
        <ul className="divide-y">
          {shortcuts.map((s) => (
            <li
              key={s.label}
              className="flex items-center justify-between gap-4 py-2.5 text-sm"
            >
              <span>{s.label}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="bg-muted rounded border px-1.5 py-0.5 text-xs font-medium"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
