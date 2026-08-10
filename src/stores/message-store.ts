import { create } from "zustand";

import type { Conversation, Role } from "@/lib/types";
import { conversations as seed } from "@/lib/mock/messages";

interface MessageState {
  conversations: Conversation[];
  send: (
    conversationId: string,
    author: string,
    role: Role,
    body: string,
  ) => void;
  markRead: (conversationId: string) => void;
  start: (input: {
    subject: string;
    recipient: string;
    author: string;
    role: Role;
    body: string;
  }) => string;
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: seed,

  start({ subject, recipient, author, role, body }) {
    const id = `cnv_${Date.now()}`;
    const now = new Date().toISOString();
    set((state) => ({
      conversations: [
        {
          id,
          subject,
          participants: [author, recipient],
          unread: 0,
          lastMessageAt: now,
          messages: [
            {
              id: `m_${Date.now()}`,
              author,
              authorRole: role,
              body,
              timestamp: now,
              status: "sent",
              attachments: [],
            },
          ],
        },
        ...state.conversations,
      ],
    }));
    return id;
  },

  send(conversationId, author, role, body) {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessageAt: new Date().toISOString(),
              messages: [
                ...c.messages,
                {
                  id: `m_${Date.now()}`,
                  author,
                  authorRole: role,
                  body,
                  timestamp: new Date().toISOString(),
                  status: "sent",
                  attachments: [],
                },
              ],
            }
          : c,
      ),
    }));
  },

  markRead(conversationId) {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unread: 0 } : c,
      ),
    }));
  },
}));
