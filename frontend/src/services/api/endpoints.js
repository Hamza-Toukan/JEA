/**
 * Centralized API path registry.
 */

export const API_ENDPOINTS = {
  auth: {
    login: "/api/admin/auth/login",
    verifyOtp: "/api/admin/auth/verify-otp",
    refresh: "/api/admin/auth/refresh-token",
  },

  conversations: {
    list: "/api/v1/sessions",
    messages: (id) => `/api/v1/messages?session_id=${encodeURIComponent(id)}`,
    mode: (id) => `/api/v1/sessions/${encodeURIComponent(id)}/handover`,
    status: (id) => `/api/v1/sessions/${encodeURIComponent(id)}/status`,
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

  users: {
    list: "/api/v1/users",
    create: "/api/v1/users",
    detail: (id) => `/api/v1/users/${id}`,
    update: (id) => `/api/v1/users/${id}`,
    delete: (id) => `/api/v1/users/${id}`,
  },

  ratings: {
    list: "/api/v1/ratings",
    create: "/api/v1/ratings",
    detail: (id) => `/api/v1/ratings/${id}`,
    update: (id) => `/api/v1/ratings/${id}`,
    delete: (id) => `/api/v1/ratings/${id}`,
  },

  campaigns: {
    list: "/api/v1/campaigns",
    create: "/api/v1/campaigns",
    detail: (id) => `/api/v1/campaigns/${id}`,
    update: (id) => `/api/v1/campaigns/${id}`,
    delete: (id) => `/api/v1/campaigns/${id}`,
  },

  messages: {
    list: "/api/v1/messages",
    create: "/api/v1/messages",
    detail: (id) => `/api/v1/messages/${id}`,
    update: (id) => `/api/v1/messages/${id}`,
    delete: (id) => `/api/v1/messages/${id}`,
  },

  sessions: {
    list: "/api/v1/sessions",
    create: "/api/v1/sessions",
    detail: (id) => `/api/v1/sessions/${id}`,
    update: (id) => `/api/v1/sessions/${id}`,
    delete: (id) => `/api/v1/sessions/${id}`,
  },

  customers: {
    list: "/api/v1/customers",
    create: "/api/v1/customers",
    detail: (id) => `/api/v1/customers/${id}`,
    update: (id) => `/api/v1/customers/${id}`,
    delete: (id) => `/api/v1/customers/${id}`,
  },

  employees: {
    list: "/api/v1/employees",
    create: "/api/v1/employees",
    detail: (id) => `/api/v1/employees/${id}`,
    update: (id) => `/api/v1/employees/${id}`,
    delete: (id) => `/api/v1/employees/${id}`,
  },
};
