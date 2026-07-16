import { API_ENDPOINTS } from "../api/endpoints";
import { get, patch, post } from "../api/request";

/**
 * @param {Object} [params]
 */
export function listConversations(params = {}) {
  return get(API_ENDPOINTS.conversations.list, {
    params: {
      page: params.page != null ? String(params.page) : undefined,
      limit: params.limit != null ? String(params.limit) : undefined,
    },
  });
}

/**
 * @param {string} conversationId
 */
export function listMessages(conversationId) {
  return get(API_ENDPOINTS.conversations.messages(conversationId));
}

/**
 * @param {string} conversationId
 * @param {boolean} isHandover
 */
export function updateConversationHandover(conversationId, isHandover) {
  return patch(API_ENDPOINTS.conversations.mode(conversationId), { is_handover: isHandover });
}

/**
 * @param {string} conversationId
 * @param {'OPEN' | 'CLOSED' | 'PENDING'} status
 */
export function updateConversationStatus(conversationId, status) {
  return patch(API_ENDPOINTS.conversations.status(conversationId), { status });
}

/**
 * @param {string} to
 * @param {string} message
 */
export function sendWhatsAppMessage(to, message) {
  return post(API_ENDPOINTS.whatsapp.send, { to, message });
}

export const conversationsService = {
  listConversations,
  listMessages,
  updateConversationHandover,
  updateConversationStatus,
  sendWhatsAppMessage,
};
