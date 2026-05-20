import { useAuthStore } from "@/store";

/**
 * Auth selectors — use in components instead of reading store ad hoc.
 */
export function useAuth() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const hasRole = useAuthStore((s) => s.hasRole);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);

  return {
    token,
    user,
    isAuthenticated,
    isHydrated,
    hasRole,
    setSession,
    clearSession,
  };
}
