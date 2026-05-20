import { create } from "zustand";

/**
 * @typedef {'info' | 'success' | 'warning' | 'danger'} ToastVariant
 */

/**
 * @typedef {Object} Toast
 * @property {string} id
 * @property {string} title
 * @property {string} [message]
 * @property {ToastVariant} [variant]
 * @property {number} [durationMs]
 * @property {boolean} [read]
 * @property {string} [createdAt]
 */

const DEFAULT_TOAST_MS = 5_000;
const MAX_TOASTS = 5;
const MAX_NOTIFICATIONS = 50;

export const useNotificationsStore = create((set) => ({
  /** Persistent notification center items */
  items: [],

  /** Ephemeral toasts (auto-dismiss) */
  toasts: [],

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
      ].slice(0, MAX_NOTIFICATIONS),
    })),

  /**
   * @param {Omit<Toast, 'id' | 'createdAt'>} toast
   */
  addToast: (toast) => {
    const id = crypto.randomUUID();
    const durationMs = toast.durationMs ?? DEFAULT_TOAST_MS;

    set((s) => ({
      toasts: [
        {
          id,
          createdAt: new Date().toISOString(),
          variant: "info",
          ...toast,
        },
        ...s.toasts,
      ].slice(0, MAX_TOASTS),
    }));

    if (durationMs > 0) {
      setTimeout(() => {
        useNotificationsStore.getState().dismissToast(id);
      }, durationMs);
    }

    return id;
  },

  dismissToast: (id) =>
    set((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    })),

  markRead: (id) =>
    set((s) => ({
      items: s.items.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),

  clearAll: () => set({ items: [] }),
}));
