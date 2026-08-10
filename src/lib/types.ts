/**
 * Core domain types for the Client Portal Starter.
 * These are intentionally transport-agnostic so they can be reused when a
 * real API/backend is introduced (see docs/architecture.md).
 */

export type Role = "client" | "manager" | "agent" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  company: string;
  avatarUrl?: string;
  status: "active" | "suspended";
  createdAt: string;
}

export type ProjectStatus =
  "planning" | "in_progress" | "on_hold" | "completed";

export interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  progress: number; // 0-100
  budget: number;
  spent: number;
  startDate: string;
  dueDate: string;
  owner: string;
  health: "on_track" | "at_risk" | "off_track";
  description: string;
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: string;
  title: string;
  done: boolean;
  assignee: string;
  dueDate: string;
}

export type TicketStatus =
  "open" | "in_progress" | "waiting_on_customer" | "resolved" | "closed";

export type Priority = "low" | "medium" | "high" | "urgent";

export type TicketCategory =
  "technical" | "billing" | "account" | "feature_request" | "general";

export interface TicketEvent {
  id: string;
  type: "created" | "comment" | "status_change" | "assignment" | "resolution";
  author: string;
  timestamp: string;
  message: string;
}

export interface Ticket {
  id: string;
  reference: string; // e.g. TKT-1042
  subject: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  category: TicketCategory;
  requester: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  timeline: TicketEvent[];
  hasAttachments: boolean;
  attachments?: { name: string; sizeKb: number }[];
  /** Customer satisfaction rating (1-5) captured after resolution. */
  satisfaction?: number;
}

export type DocumentCategory =
  "contracts" | "invoices" | "reports" | "deliverables" | "compliance";

export interface DocumentVersion {
  version: string;
  uploadedBy: string;
  uploadedAt: string;
  sizeKb: number;
  note?: string;
}

export interface PortalDocument {
  id: string;
  name: string;
  type: "pdf" | "docx" | "xlsx" | "png" | "zip";
  category: DocumentCategory;
  sizeKb: number;
  owner: string;
  updatedAt: string;
  confidential: boolean;
  accessRoles: Role[];
  versions: DocumentVersion[];
}

export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft";

export interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  lineItems: { description: string; quantity: number; unitPrice: number }[];
}

export interface Conversation {
  id: string;
  subject: string;
  participants: string[];
  unread: number;
  lastMessageAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  author: string;
  authorRole: Role;
  body: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments: { name: string; sizeKb: number }[];
}

export type NotificationType =
  "ticket" | "invoice" | "document" | "message" | "project" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  href?: string;
}

export type ActivityAction =
  | "login"
  | "logout"
  | "profile_update"
  | "document_download"
  | "document_upload"
  | "ticket_create"
  | "ticket_update"
  | "message_sent"
  | "settings_update"
  | "invoice_view";

export interface ActivityEvent {
  id: string;
  action: ActivityAction;
  actor: string;
  target: string;
  timestamp: string;
  ip: string;
  device: string;
  metadata?: Record<string, string>;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  severity: "info" | "warning" | "success";
}
