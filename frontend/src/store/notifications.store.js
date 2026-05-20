import { create } from "zustand";

/**
 * @typedef {{ id: string, title: string, message?: string, variant?: string, read?: boolean, createdAt?: string }} AppNotification
 */

export const useNotificationsStore = create((set) => ({
  items: [],

  addNotification: (notification) =>
    set((s) => ({
      items: [
        {
          id: crypto.randomUUID(),
          read: false,
          createdAt: new Date().toISOString(),
          ...notification,
        },
        ...s.items,
      ].slice(0, 50),
    })),

  markRead: (id) =>
    set((s) => ({
      items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  clearAll: () => set({ items: [] }),
}));
