import { create } from "zustand";

/**
 * Global UI chrome state (sidebar, theme prep, drawers).
 */
export const useUiStore = create((set) => ({
  sidebarCollapsed: false,
  theme: "light",

  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  setTheme: (theme) => set({ theme }),
}));
