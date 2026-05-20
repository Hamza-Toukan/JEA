/**
 * Centralized API path registry.
 */

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    me: "/api/auth/me",
    refresh: "/api/auth/refresh",
  },

  conversations: {
    list: "/api/conversations",
    detail: (id) => `/api/conversations/${id}`,
    messages: (id) => `/api/conversations/${id}/messages`,
    mode: (id) => `/api/conversations/${id}/mode`,
    status: (id) => `/api/conversations/${id}/status`,
    ticketStatus: (id) => `/api/conversations/${id}/ticket-status`,
    notes: (id) => `/api/conversations/${id}/notes`,
  },

  analytics: {
    overview: "/api/analytics/overview",
    operations: "/api/analytics/operations",
  },

  workflows: {
    list: "/api/workflows",
    detail: (id) => `/api/workflows/${id}`,
  },

  knowledgeBase: {
    list: "/api/knowledge-base/articles",
    detail: (id) => `/api/knowledge-base/articles/${id}`,
  },
};
