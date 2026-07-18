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
    id: String(item.id ?? item.conversationId ?? item.session_id ?? ""),
    name: String(item.name ?? item.memberName ?? item.displayName ?? item.session_id ?? ""),
    topic: String(item.topic ?? item.subject ?? item.title ?? ""),
    preview: String(item.preview ?? item.lastMessage ?? item.snippet ?? ""),
    time: String(item.time ?? item.updatedAt ?? item.updated_at ?? item.created_at ?? item.lastMessageAt ?? ""),
    verified: Boolean(item.verified),
    unread: Boolean(item.unread ?? item.hasUnread ?? item.is_handover),
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

  const rawTime = String(item.time ?? item.createdAt ?? item.created_at ?? item.sentAt ?? "");
  const timeStr = rawTime ? new Date(rawTime).toLocaleTimeString("ar-JO", { hour: "2-digit", minute: "2-digit" }) : "";
  const fromStr = String(item.sender ?? item.role ?? item.from ?? "member");
  const isAi = Boolean(item.isAi || item.fromAi || item.sender === "bot" || fromStr === "SERVER");

  return {
    id: String(item.id ?? item.message_id ?? item.messageId ?? ""),
    conversationId: String(item.conversationId ?? item.session_id ?? ""),
    text: String(item.body ?? item.content ?? item.text ?? ""),
    role: isAi ? "ai" : "user",
    time: timeStr,
    isAi,
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
