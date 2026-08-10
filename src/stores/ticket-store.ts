import { create } from "zustand";

import type {
  Priority,
  Ticket,
  TicketCategory,
  TicketEvent,
  TicketStatus,
} from "@/lib/types";
import { tickets as seed } from "@/lib/mock/tickets";

interface NewTicket {
  subject: string;
  description: string;
  category: TicketCategory;
  priority: Priority;
  requester: string;
  attachments?: { name: string; sizeKb: number }[];
}

interface TicketState {
  tickets: Ticket[];
  create: (input: NewTicket) => Ticket;
  addComment: (id: string, author: string, message: string) => void;
  setStatus: (id: string, status: TicketStatus, author: string) => void;
  assign: (id: string, assignee: string, author: string) => void;
  rate: (id: string, satisfaction: number) => void;
}

let counter = 1043;

export const useTicketStore = create<TicketState>((set) => ({
  tickets: seed,

  create(input) {
    const now = new Date().toISOString();
    const ref = `TKT-${counter++}`;
    const event: TicketEvent = {
      id: `e_${Date.now()}`,
      type: "created",
      author: input.requester,
      timestamp: now,
      message: `Ticket created with priority ${input.priority}.`,
    };
    const ticket: Ticket = {
      id: `tkt_${Date.now()}`,
      reference: ref,
      subject: input.subject,
      description: input.description,
      category: input.category,
      priority: input.priority,
      status: "open",
      requester: input.requester,
      assignee: undefined,
      createdAt: now,
      updatedAt: now,
      hasAttachments: Boolean(input.attachments?.length),
      attachments: input.attachments ?? [],
      timeline: [event],
    };
    set((state) => ({ tickets: [ticket, ...state.tickets] }));
    return ticket;
  },

  addComment(id, author, message) {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...t.timeline,
                {
                  id: `e_${Date.now()}`,
                  type: "comment",
                  author,
                  timestamp: new Date().toISOString(),
                  message,
                },
              ],
            }
          : t,
      ),
    }));
  },

  setStatus(id, status, author) {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...t.timeline,
                {
                  id: `e_${Date.now()}`,
                  type:
                    status === "resolved" || status === "closed"
                      ? "resolution"
                      : "status_change",
                  author,
                  timestamp: new Date().toISOString(),
                  message: `Status changed to ${status.replace(/_/g, " ")}.`,
                },
              ],
            }
          : t,
      ),
    }));
  },

  assign(id, assignee, author) {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              assignee,
              updatedAt: new Date().toISOString(),
              timeline: [
                ...t.timeline,
                {
                  id: `e_${Date.now()}`,
                  type: "assignment",
                  author,
                  timestamp: new Date().toISOString(),
                  message: `Assigned to ${assignee}.`,
                },
              ],
            }
          : t,
      ),
    }));
  },

  rate(id, satisfaction) {
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, satisfaction } : t,
      ),
    }));
  },
}));
