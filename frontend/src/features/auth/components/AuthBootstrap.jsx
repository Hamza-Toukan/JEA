import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { useAuthBootstrap } from "../hooks/use-auth-bootstrap";

/**
 * Session validation — renders nothing; runs bootstrap side effects.
 */
export function AuthBootstrap({ children }) {
  useAuthBootstrap();

  useEffect(() => {
    // Explicitly mark authentication store as hydrated after mount
    useAuthStore.getState().setHydrated(true);
  }, []);

  return children;
}
