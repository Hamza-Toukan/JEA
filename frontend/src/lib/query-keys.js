/**
 * React Query key factory — keeps cache keys consistent across features.
 */

export const queryKeys = {
  auth: {
    all: ["auth"],
    me: () => [...queryKeys.auth.all, "me"],
  },

  conversations: {
    all: ["conversations"],
    lists: () => [...queryKeys.conversations.all, "list"],
    list: (filters) => [...queryKeys.conversations.lists(), filters],
    details: () => [...queryKeys.conversations.all, "detail"],
    detail: (id) => [...queryKeys.conversations.details(), id],
    messages: (id, params) => [
      ...queryKeys.conversations.detail(id),
      "messages",
      params,
    ],
  },

  analytics: {
    all: ["analytics"],
    overview: (range) => [...queryKeys.analytics.all, "overview", range],
    operations: (range) => [...queryKeys.analytics.all, "operations", range],
  },

  workflows: {
    all: ["workflows"],
    lists: () => [...queryKeys.workflows.all, "list"],
    list: (params) => [...queryKeys.workflows.lists(), params],
    detail: (id) => [...queryKeys.workflows.all, "detail", id],
  },

  knowledgeBase: {
    all: ["knowledge-base"],
    lists: () => [...queryKeys.knowledgeBase.all, "list"],
    list: (params) => [...queryKeys.knowledgeBase.lists(), params],
    detail: (id) => [...queryKeys.knowledgeBase.all, "detail", id],
  },
};
