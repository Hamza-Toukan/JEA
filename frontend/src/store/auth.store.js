import { create } from "zustand";
import { persist } from "zustand/middleware";
import { hasAnyRole } from "@/constants/roles";

/**
 * @typedef {Object} AuthUser
 * @property {string} [id]
 * @property {string} [email]
 * @property {string} [name]
 * @property {string | string[]} [role]
 * @property {string[]} [roles]
 */

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isHydrated: false,

      setSession: (token, user, refreshToken = null) =>
        set({
          token,
          refreshToken,
          user,
          isAuthenticated: Boolean(token),
        }),

      clearSession: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      setHydrated: (isHydrated) => set({ isHydrated }),

      /**
       * @param {string | string[]} required
       */
      hasRole: (required) => {
        const user = get().user;
        const roles = user?.roles ?? user?.role;
        return hasAnyRole(roles, required);
      },
    }),
    {
      name: "jea-admin-auth",
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("[auth] rehydrate failed", error);
        }
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
