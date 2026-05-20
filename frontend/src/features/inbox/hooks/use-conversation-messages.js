import { useQuery } from "@tanstack/react-query";
import { APP_CONFIG } from "@/config/app";
import { queryKeys } from "@/lib/query-keys";
import { conversationsService } from "@/services/conversations";
import { INBOX_POLL_INTERVAL_MS } from "../constants";
import { normalizeMessageList } from "../lib/normalize";

/**
 * Messages for selected thread — polling-ready for future realtime swap.
 * @param {string | null | undefined} conversationId
 */
export function useConversationMessages(conversationId, options = {}) {
  return useQuery({
    queryKey: queryKeys.conversations.messages(conversationId, {
      page: options.page ?? 1,
    }),
    queryFn: async () => {
      const data = await conversationsService.listMessages(conversationId, {
        page: options.page ?? 1,
        limit: options.limit ?? 50,
      });
      return normalizeMessageList(data);
    },
    enabled:
      APP_CONFIG.apiEnabled &&
      Boolean(conversationId) &&
      (options.enabled ?? true),
    refetchInterval: options.poll !== false ? INBOX_POLL_INTERVAL_MS : false,
    placeholderData: (previous) => previous,
  });
}
