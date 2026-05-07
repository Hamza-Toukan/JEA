const mongoose = require("mongoose");
const { Conversation } = require("./conversation.model");
const { Message } = require("./message.model");

async function findOrCreateOpenConversationByPhone(customerPhone) {
  let conversation = await Conversation.findOne({
    customerPhone,
    status: "open"
  });

  if (!conversation) {
    conversation = await Conversation.create({
      customerPhone,
      status: "open",
      mode: "bot",
      lastMessageAt: new Date()
    });
  }

  return conversation;
}

async function createMessage({
  conversationId,
  direction,
  senderType,
  text,
  provider = "mock",
  providerMessageId = null,
  messageType = "text",
  metadata = {}
}) {
  return Message.create({
    conversationId,
    direction,
    senderType,
    text,
    provider,
    providerMessageId,
    messageType,
    metadata
  });
}

async function updateConversationLastMessage(conversationId, text) {
  return Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessageText: text || "",
      lastMessageAt: new Date()
    },
    { new: true }
  );
}

async function handleIncomingCustomerMessage({
  customerPhone,
  text,
  provider = "mock",
  providerMessageId = null,
  metadata = {}
}) {
  const conversation = await findOrCreateOpenConversationByPhone(customerPhone);

  const inboundMessage = await createMessage({
    conversationId: conversation._id,
    direction: "inbound",
    senderType: "customer",
    text,
    provider,
    providerMessageId,
    messageType: "text",
    metadata
  });

  await updateConversationLastMessage(conversation._id, text);

  return {
    conversation,
    inboundMessage
  };
}

async function saveBotReply({ conversationId, text, provider = "mock", metadata = {} }) {
  const outboundMessage = await createMessage({
    conversationId,
    direction: "outbound",
    senderType: "bot",
    text,
    provider,
    providerMessageId: `mock_out_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    messageType: "text",
    metadata
  });

  await updateConversationLastMessage(conversationId, text);

  return outboundMessage;
}

async function listConversations({
  page = 1,
  limit = 20,
  status,
  mode,
  search
}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  if (mode) {
    filter.mode = mode;
  }

  if (search) {
    filter.customerPhone = {
      $regex: search,
      $options: "i"
    };
  }

  const [items, total] = await Promise.all([
    Conversation.find(filter)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Conversation.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit)
    }
  };
}

async function getConversationById(conversationId) {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return null;
  }

  return Conversation.findById(conversationId).lean();
}

async function listMessagesByConversationId({
  conversationId,
  page = 1,
  limit = 50
}) {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return null;
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const filter = {
    conversationId
  };

  const [items, total] = await Promise.all([
    Message.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Message.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit)
    }
  };
}

module.exports = {
  findOrCreateOpenConversationByPhone,
  createMessage,
  updateConversationLastMessage,
  handleIncomingCustomerMessage,
  saveBotReply,
  listConversations,
  getConversationById,
  listMessagesByConversationId
};