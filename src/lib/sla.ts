import type { Priority, Ticket } from "@/lib/types";
import { formatRelativeTime } from "@/lib/format";

/**
 * Service-level targets (time-to-resolve) by priority, in hours. Used to derive
 * a ticket's due date and its SLA state for the UI. In production these would
 * come from the customer's contract/SLA policy.
 */
export const SLA_HOURS: Record<Priority, number> = {
  urgent: 4,
  high: 24,
  medium: 72,
  low: 168,
};

export function dueDateForPriority(from: Date, priority: Priority): string {
  return new Date(
    from.getTime() + SLA_HOURS[priority] * 60 * 60 * 1000,
  ).toISOString();
}

export type SlaState = "ok" | "due_soon" | "overdue" | "none";

export interface SlaMeta {
  state: SlaState;
  label: string;
}

/**
 * Derive SLA presentation for a ticket. Resolved/closed and
 * waiting-on-customer tickets have no active SLA clock.
 */
export function ticketSla(ticket: Ticket): SlaMeta {
  if (
    !ticket.dueDate ||
    ticket.status === "resolved" ||
    ticket.status === "closed" ||
    ticket.status === "waiting_on_customer"
  ) {
    return { state: "none", label: "—" };
  }

  const diffMs = new Date(ticket.dueDate).getTime() - Date.now();
  if (diffMs < 0) return { state: "overdue", label: "Overdue" };
  if (diffMs < 24 * 60 * 60 * 1000) {
    return {
      state: "due_soon",
      label: `Due ${formatRelativeTime(ticket.dueDate)}`,
    };
  }
  return { state: "ok", label: `Due ${formatRelativeTime(ticket.dueDate)}` };
}
