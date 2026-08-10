import { create } from "zustand";

import type { Notification } from "@/lib/types";
import { notifications as seed } from "@/lib/mock/notifications";

interface NotificationState {
  items: Notification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: seed,
  markRead(id) {
    set((state) => ({
      items: state.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },
  markAllRead() {
    set((state) => ({
      items: state.items.map((n) => ({ ...n, read: true })),
    }));
  },
  dismiss(id) {
    set((state) => ({ items: state.items.filter((n) => n.id !== id) }));
  },
  clearAll() {
    set({ items: [] });
  },
  unreadCount() {
    return get().items.filter((n) => !n.read).length;
  },
}));
