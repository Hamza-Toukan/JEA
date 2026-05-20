import { useQuery } from "@tanstack/react-query";
import { APP_CONFIG } from "@/config/app";
import { queryKeys } from "@/lib/query-keys";
import { conversationsService } from "@/services/conversations";
import { useConversationsStore } from "@/store";
import { useDebounce } from "@/hooks/useDebounce";
import { INBOX_POLL_INTERVAL_MS } from "../constants";
import { normalizeConversationList } from "../lib/normalize";

/**
 * Inbox conversation list — polling-ready, API-gated by APP_CONFIG.apiEnabled.
 */
export function useInboxConversations(options = {}) {
  const inboxFilter = useConversationsStore((s) => s.inboxFilter);
  const searchQuery = useConversationsStore((s) => s.searchQuery);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filters = {
    status: inboxFilter === "all" ? undefined : inboxFilter,
    search: debouncedSearch || undefined,
    page: options.page ?? 1,
    limit: options.limit ?? 25,
  };

  return useQuery({
    queryKey: queryKeys.conversations.list(filters),
    queryFn: async () => {
      const data = await conversationsService.listConversations(filters);
      return normalizeConversationList(data);
    },
    enabled: APP_CONFIG.apiEnabled && (options.enabled ?? true),
    refetchInterval: options.poll !== false ? INBOX_POLL_INTERVAL_MS : false,
    placeholderData: (previous) => previous,
  });
}
