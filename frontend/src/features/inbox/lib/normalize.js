/**
 * Normalize API conversation/message payloads for UI consumption.
 * Keeps pages decoupled from backend response shapes.
 */

/**
 * @param {unknown} raw
 */
export function normalizeConversation(raw) {
  if (!raw || typeof raw !== "object") return null;

  const item = /** @type {Record<string, unknown>} */ (raw);

  return {
    id: String(item.id ?? item.conversationId ?? ""),
    name: String(item.name ?? item.memberName ?? item.displayName ?? ""),
    topic: String(item.topic ?? item.subject ?? item.title ?? ""),
    preview: String(item.preview ?? item.lastMessage ?? item.snippet ?? ""),
    time: String(item.time ?? item.updatedAt ?? item.lastMessageAt ?? ""),
    verified: Boolean(item.verified),
    unread: Boolean(item.unread ?? item.hasUnread),
    priority: Boolean(item.priority ?? item.isPriority),
    mode: item.mode ?? item.conversationMode ?? null,
    status: item.status ?? item.ticketStatus ?? null,
    raw: item,
  };
}

/**
 * @param {unknown} payload
 */
export function normalizeConversationList(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.items ?? payload?.data ?? payload?.conversations ?? [];

  const total =
    payload?.total ??
    payload?.meta?.total ??
    payload?.pagination?.total ??
    list.length;

  const page = payload?.page ?? payload?.meta?.page ?? payload?.pagination?.page ?? 1;

  const limit =
    payload?.limit ?? payload?.meta?.limit ?? payload?.pagination?.limit ?? list.length;

  return {
    items: list.map(normalizeConversation).filter(Boolean),
    total,
    page,
    limit,
    hasMore: page * limit < total,
  };
}

/**
 * @param {unknown} raw
 */
export function normalizeMessage(raw) {
  if (!raw || typeof raw !== "object") return null;

  const item = /** @type {Record<string, unknown>} */ (raw);

  return {
    id: String(item.id ?? item.messageId ?? ""),
    conversationId: String(item.conversationId ?? ""),
    body: String(item.body ?? item.content ?? item.text ?? ""),
    sender: String(item.sender ?? item.role ?? item.from ?? "member"),
    time: String(item.time ?? item.createdAt ?? item.sentAt ?? ""),
    isAi: Boolean(item.isAi ?? item.fromAi ?? item.sender === "bot"),
    isSystem: Boolean(item.isSystem ?? item.type === "system"),
    raw: item,
  };
}

/**
 * @param {unknown} payload
 */
export function normalizeMessageList(payload) {
  const list = Array.isArray(payload)
    ? payload
    : payload?.items ?? payload?.data ?? payload?.messages ?? [];

  return {
    items: list.map(normalizeMessage).filter(Boolean),
    total: payload?.total ?? list.length,
    hasMore: Boolean(payload?.hasMore ?? payload?.meta?.hasMore),
  };
}
