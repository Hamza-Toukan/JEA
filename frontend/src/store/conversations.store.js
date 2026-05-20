import { create } from "zustand";

/**
 * Inbox UI state only — server data lives in React Query cache.
 */
export const useConversationsStore = create((set) => ({
  selectedConversationId: null,
  inboxFilter: "all",
  searchQuery: "",
  /** Thread panel: messages vs profile */
  activePanel: "messages",
  /** Reserved for optimistic send / draft */
  messageDraft: "",

  setSelectedConversationId: (selectedConversationId) =>
    set({ selectedConversationId }),

  setInboxFilter: (inboxFilter) => set({ inboxFilter }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setActivePanel: (activePanel) => set({ activePanel }),

  setMessageDraft: (messageDraft) => set({ messageDraft }),

  resetInboxFilters: () =>
    set({
      inboxFilter: "all",
      searchQuery: "",
      selectedConversationId: null,
      messageDraft: "",
      activePanel: "messages",
    }),
}));
