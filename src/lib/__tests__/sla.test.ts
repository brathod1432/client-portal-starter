import { dueDateForPriority, ticketSla, SLA_HOURS } from "@/lib/sla";
import type { Ticket } from "@/lib/types";

function makeTicket(overrides: Partial<Ticket>): Ticket {
  return {
    id: "t",
    reference: "TKT-1",
    subject: "s",
    description: "d",
    status: "open",
    priority: "high",
    category: "technical",
    requester: "Ava",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timeline: [],
    hasAttachments: false,
    ...overrides,
  };
}

describe("SLA helpers", () => {
  it("derives a due date from priority", () => {
    const from = new Date("2025-01-01T00:00:00.000Z");
    const due = new Date(dueDateForPriority(from, "urgent"));
    expect(due.getTime() - from.getTime()).toBe(SLA_HOURS.urgent * 3600 * 1000);
  });

  it("flags overdue tickets", () => {
    const past = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    expect(ticketSla(makeTicket({ dueDate: past })).state).toBe("overdue");
  });

  it("flags due-soon tickets", () => {
    const soon = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    expect(ticketSla(makeTicket({ dueDate: soon })).state).toBe("due_soon");
  });

  it("has no active SLA for resolved or waiting tickets", () => {
    const soon = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    expect(
      ticketSla(makeTicket({ dueDate: soon, status: "resolved" })).state,
    ).toBe("none");
    expect(
      ticketSla(makeTicket({ dueDate: soon, status: "waiting_on_customer" }))
        .state,
    ).toBe("none");
  });
});
