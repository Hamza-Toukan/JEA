import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Auth state — ready for JWT integration with backend.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setSession: (token, user) =>
        set({ token, user, isAuthenticated: Boolean(token) }),

      clearSession: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "jea-admin-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
