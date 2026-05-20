import { API_ENDPOINTS } from "../api/endpoints";
import { get, patch, post } from "../api/request";

/**
 * @typedef {Object} ConversationListParams
 * @property {number} [page]
 * @property {number} [limit]
 * @property {string} [status]
 * @property {string} [mode]
 * @property {string} [search]
 */

/**
 * @param {ConversationListParams} [params]
 */
export function listConversations(params = {}) {
  return get(API_ENDPOINTS.conversations.list, {
    params: {
      page: params.page != null ? String(params.page) : undefined,
      limit: params.limit != null ? String(params.limit) : undefined,
      status: params.status,
      mode: params.mode,
      search: params.search,
    },
  });
}

/**
 * @param {string} conversationId
 */
export function getConversation(conversationId) {
  return get(API_ENDPOINTS.conversations.detail(conversationId));
}

/**
 * @param {string} conversationId
 * @param {{ page?: number, limit?: number, before?: string, after?: string }} [params]
 */
export function listMessages(conversationId, params = {}) {
  return get(API_ENDPOINTS.conversations.messages(conversationId), {
    params: {
      page: params.page != null ? String(params.page) : undefined,
      limit: params.limit != null ? String(params.limit) : undefined,
      before: params.before,
      after: params.after,
    },
  });
}

/**
 * @param {string} conversationId
 * @param {'bot' | 'human'} mode
 */
export function updateConversationMode(conversationId, mode) {
  return patch(API_ENDPOINTS.conversations.mode(conversationId), { mode });
}

/**
 * @param {string} conversationId
 * @param {string} status
 */
export function updateConversationStatus(conversationId, status) {
  return patch(API_ENDPOINTS.conversations.status(conversationId), { status });
}

/**
 * @param {string} conversationId
 * @param {string} body
 */
export function addInternalNote(conversationId, body) {
  return post(API_ENDPOINTS.conversations.notes(conversationId), { body });
}

export const conversationsService = {
  listConversations,
  getConversation,
  listMessages,
  updateConversationMode,
  updateConversationStatus,
  addInternalNote,
};
