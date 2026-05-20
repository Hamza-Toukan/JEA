import { useAuthBootstrap } from "../hooks/use-auth-bootstrap";

/**
 * Session validation — renders nothing; runs bootstrap side effects.
 */
export function AuthBootstrap({ children }) {
  useAuthBootstrap();
  return children;
}
