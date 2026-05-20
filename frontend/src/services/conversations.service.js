import { api } from "./api/client";

/**
 * @param {Object} [params]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {string} [params.status]
 * @param {string} [params.mode]
 * @param {string} [params.search]
 * @param {string} [token]
 */
export async function listConversations(params = {}, token) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  if (params.status) search.set("status", params.status);
  if (params.mode) search.set("mode", params.mode);
  if (params.search) search.set("search", params.search);

  const qs = search.toString();
  return api.get(`/api/conversations${qs ? `?${qs}` : ""}`, { token });
}

/**
 * @param {string} conversationId
 * @param {string} [token]
 */
export async function getConversation(conversationId, token) {
  return api.get(`/api/conversations/${conversationId}`, { token });
}

/**
 * @param {string} conversationId
 * @param {Object} [params]
 * @param {string} [token]
 */
export async function listMessages(conversationId, params = {}, token) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return api.get(
    `/api/conversations/${conversationId}/messages${qs ? `?${qs}` : ""}`,
    { token }
  );
}

/**
 * @param {string} conversationId
 * @param {'bot' | 'human'} mode
 * @param {string} [token]
 */
export async function updateConversationMode(conversationId, mode, token) {
  return api.patch(
    `/api/conversations/${conversationId}/mode`,
    { mode },
    { token }
  );
}

export const conversationsService = {
  listConversations,
  getConversation,
  listMessages,
  updateConversationMode,
};
