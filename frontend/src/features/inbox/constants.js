import { APP_CONFIG } from "@/config/app";

/** Polling interval when realtime transport is unavailable */
export const INBOX_POLL_INTERVAL_MS = APP_CONFIG.inboxPollIntervalMs;

/** Default page size for conversation/message lists */
export const INBOX_PAGE_SIZE = 25;

export const INBOX_FILTERS = {
  ALL: "all",
  UNREAD: "unread",
  AI: "ai",
  PRIORITY: "priority",
};
