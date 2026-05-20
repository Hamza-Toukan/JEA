/**
 * Mutation helpers — optimistic update patterns (future).
 *
 * Example flow when send-message ships:
 * 1. onMutate: snapshot query cache + apply optimistic message
 * 2. onError: rollback snapshot + handleApiError
 * 3. onSettled: invalidate queryKeys.conversations.messages(id)
 */

/**
 * @param {import('@tanstack/react-query').QueryClient} queryClient
 * @param {readonly unknown[]} queryKey
 * @param {(old: unknown) => unknown} updater
 */
export function patchQueryData(queryClient, queryKey, updater) {
  queryClient.setQueryData(queryKey, (old) => updater(old));
}
