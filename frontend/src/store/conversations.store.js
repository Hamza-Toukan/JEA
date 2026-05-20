import { create } from "zustand";

/**
 * Inbox / conversations UI state — filters, selection, list cache prep.
 */
export const useConversationsStore = create((set) => ({
  selectedConversationId: null,
  inboxFilter: "all",
  searchQuery: "",

  setSelectedConversationId: (selectedConversationId) =>
    set({ selectedConversationId }),

  setInboxFilter: (inboxFilter) => set({ inboxFilter }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  resetInboxFilters: () =>
    set({ inboxFilter: "all", searchQuery: "", selectedConversationId: null }),
}));
