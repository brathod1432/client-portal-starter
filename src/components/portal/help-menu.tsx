"use client";

import Link from "next/link";
import {
  HelpCircle,
  LifeBuoy,
  MessageSquare,
  BookOpen,
  Keyboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Quick-access help menu in the header. Surfaces the most common "I need help"
 * actions so users never have to hunt for them.
 */
export function HelpMenu() {
  function openShortcuts() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "?" }));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Help and support">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Help &amp; support</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/tickets/new">
            <LifeBuoy />
            Open a ticket
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/messages">
            <MessageSquare />
            Message your team
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/help-center">
            <BookOpen />
            Help center
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={openShortcuts}>
          <Keyboard />
          Keyboard shortcuts
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
