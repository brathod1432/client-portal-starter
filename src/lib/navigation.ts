import {
  LayoutDashboard,
  FolderKanban,
  LifeBuoy,
  FileText,
  Receipt,
  MessageSquare,
  Bell,
  User,
  Settings,
  HelpCircle,
  History,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import type { Permission } from "@/lib/rbac";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Permission required to see this item. Omitted = always visible. */
  permission?: Permission;
  /** Optional badge key resolved at render (e.g. unread counts). */
  badge?: "notifications" | "messages" | "tickets";
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard:view",
      },
      {
        title: "Projects",
        href: "/projects",
        icon: FolderKanban,
        permission: "projects:view",
      },
    ],
  },
  {
    label: "Workspace",
    items: [
      {
        title: "Tickets",
        href: "/tickets",
        icon: LifeBuoy,
        permission: "tickets:view",
        badge: "tickets",
      },
      {
        title: "Documents",
        href: "/documents",
        icon: FileText,
        permission: "documents:view",
      },
      {
        title: "Invoices",
        href: "/invoices",
        icon: Receipt,
        permission: "invoices:view",
      },
      {
        title: "Messages",
        href: "/messages",
        icon: MessageSquare,
        permission: "messages:view",
        badge: "messages",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
        permission: "notifications:view",
        badge: "notifications",
      },
      {
        title: "Activity Log",
        href: "/activity-log",
        icon: History,
        permission: "activity:view:self",
      },
      { title: "Profile", href: "/profile", icon: User },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        permission: "settings:manage:self",
      },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Help Center", href: "/help-center", icon: HelpCircle },
      { title: "Showcase", href: "/showcase", icon: Sparkles },
    ],
  },
];
