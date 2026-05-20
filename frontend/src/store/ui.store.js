import { create } from "zustand";

/**
 * Global UI chrome — sidebar, mobile nav, theme (future).
 */
export const useUiStore = create((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  theme: "light",

  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),

  closeMobileNav: () => set({ mobileNavOpen: false }),

  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
    }
    set({ theme });
  },
}));
