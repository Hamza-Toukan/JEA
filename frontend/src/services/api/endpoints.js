/**
 * Centralized API path registry.
 */

export const API_ENDPOINTS = {
  auth: {
    login: "/api/admin/auth/login",
    verifyOtp: "/api/admin/auth/verify-otp",
    refresh: "/api/admin/auth/refresh",
  },

  conversations: {
    list: "/api/admin/sessions",
    messages: (id) => `/api/admin/sessions/${id}/messages`,
    mode: (id) => `/api/admin/sessions/${id}/handover`,
    status: (id) => `/api/admin/sessions/${id}/status`,
  },

  analytics: {
    overview: "/api/admin/dashboard",
  },

  whatsapp: {
    send: "/api/whatsapp/send",
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
