import { useTicketStore } from "@/stores/ticket-store";

describe("ticket store", () => {
  it("creates a ticket with an opening timeline event", () => {
    const before = useTicketStore.getState().tickets.length;
    const ticket = useTicketStore.getState().create({
      subject: "Printer offline",
      description: "The lobby printer will not connect to the network.",
      category: "technical",
      priority: "medium",
      requester: "Ava Thompson",
    });

    expect(useTicketStore.getState().tickets.length).toBe(before + 1);
    expect(ticket.status).toBe("open");
    expect(ticket.timeline).toHaveLength(1);
    expect(ticket.timeline[0].type).toBe("created");
  });

  it("adds comments and updates status with audit events", () => {
    const ticket = useTicketStore.getState().create({
      subject: "VPN drops",
      description: "The VPN disconnects every few minutes for remote staff.",
      category: "technical",
      priority: "high",
      requester: "Ava Thompson",
    });

    useTicketStore
      .getState()
      .addComment(ticket.id, "Marcus Lee", "Looking into it.");
    useTicketStore.getState().setStatus(ticket.id, "resolved", "Marcus Lee");

    const updated = useTicketStore
      .getState()
      .tickets.find((t) => t.id === ticket.id)!;
    expect(updated.status).toBe("resolved");
    const types = updated.timeline.map((e) => e.type);
    expect(types).toContain("comment");
    expect(types).toContain("resolution");
  });
});
