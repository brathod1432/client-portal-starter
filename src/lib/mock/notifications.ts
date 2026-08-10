import type { Announcement, Notification } from "@/lib/types";

export const notifications: Notification[] = [
  {
    id: "ntf_001",
    type: "ticket",
    title: "Ticket TKT-1042 updated",
    body: "Marcus Lee moved your ticket to In Progress.",
    timestamp: "2025-08-05T14:30:00.000Z",
    read: false,
    href: "/tickets/tkt_1042",
  },
  {
    id: "ntf_002",
    type: "message",
    title: "New message from Marcus Lee",
    body: "Replacement SFP is being couriered and installed tomorrow.",
    timestamp: "2025-08-05T14:30:00.000Z",
    read: false,
    href: "/messages",
  },
  {
    id: "ntf_003",
    type: "invoice",
    title: "Invoice INV-2025-06 is overdue",
    body: "$24,900.00 was due on Jun 30, 2025.",
    timestamp: "2025-08-01T08:00:00.000Z",
    read: false,
    href: "/invoices",
  },
  {
    id: "ntf_004",
    type: "document",
    title: "New document shared",
    body: "Statement of Work — Portal Launch.docx was added to Contracts.",
    timestamp: "2025-07-28T09:30:00.000Z",
    read: true,
    href: "/documents",
  },
  {
    id: "ntf_005",
    type: "project",
    title: "Project milestone reached",
    body: "Store Network Modernization is now 68% complete.",
    timestamp: "2025-07-20T10:00:00.000Z",
    read: true,
    href: "/projects/prj_001",
  },
  {
    id: "ntf_006",
    type: "system",
    title: "Scheduled maintenance",
    body: "The portal will be briefly unavailable on Aug 17, 02:00–03:00 UTC.",
    timestamp: "2025-07-18T09:00:00.000Z",
    read: true,
  },
];

export const announcements: Announcement[] = [
  {
    id: "ann_001",
    title: "New: pay invoices directly in the portal",
    body: "You can now settle outstanding invoices without leaving the billing page. ACH and card supported.",
    date: "2025-08-01",
    severity: "success",
  },
  {
    id: "ann_002",
    title: "Scheduled maintenance — Aug 17",
    body: "Expect a brief outage between 02:00 and 03:00 UTC while we upgrade our data platform.",
    date: "2025-07-18",
    severity: "warning",
  },
  {
    id: "ann_003",
    title: "Quarterly business review",
    body: "Your Q3 QBR is scheduled for September 12. Priya will share the agenda shortly.",
    date: "2025-07-10",
    severity: "info",
  },
];
