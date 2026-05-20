/**
 * Application runtime configuration.
 * Feature flags gate backend integration until APIs are ready.
 */

export const APP_CONFIG = {
  /** Enable live API calls (default: mock/static UI) */
  apiEnabled: import.meta.env.VITE_API_ENABLED === "true",

  /** Default request timeout (ms) */
  requestTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 30_000,

  /** Inbox list polling interval when realtime is off (ms) */
  inboxPollIntervalMs: Number(import.meta.env.VITE_INBOX_POLL_MS) || 30_000,

  /** Auth guard — set VITE_AUTH_GUARD=true when login is wired */
  authGuardEnabled: import.meta.env.VITE_AUTH_GUARD === "true",
};
