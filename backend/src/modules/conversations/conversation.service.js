const mongoose = require("mongoose");
const { Conversation } = require("./conversation.model");
const { Message } = require("./message.model");
const { User } = require("../users/user.model");
const { escapeRegex } = require("../../core/utils/escape-regex");
const { validateObjectId } = require("../../core/utils/validate-object-id");
const { generateMockMessageId } = require("../../core/utils/generate-mock-message-id");
const { logger } = require("../../core/logger/logger");

function httpError(statusCode, code, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

async function findOrCreateOpenConversationByPhone(customerPhone) {
  const existing = await Conversation.findOne({
    customerPhone,
    status: "open",
  });

  if (existing) {
    return existing;
  }

  try {
    return await Conversation.create({
      customerPhone,
      status: "open",
      mode: "bot",
      lastMessageAt: new Date(),
    });
  } catch (error) {
    if (error.code === 11000) {
      const recovered = await Conversation.findOne({
        customerPhone,
        status: "open",
      });
      if (!recovered) {
        throw error;
      }
      return recovered;
    }
    throw error;
  }
}

async function createMessage({
  conversationId,
  direction,
  senderType,
  text,
  provider = "mock",
  providerMessageId = null,
  messageType = "text",
  metadata = {},
  correlationInboundMessageId = null,
}) {
  try {
    const message = await Message.create({
      conversationId,
      direction,
      senderType,
      text,
      provider,
      providerMessageId,
      messageType,
      metadata,
      correlationInboundMessageId,
    });
    return { message, isDuplicate: false };
  } catch (error) {
    if (error.code === 11000) {
      let message = null;

      if (correlationInboundMessageId) {
        message = await Message.findOne({
          correlationInboundMessageId,
          senderType: "bot",
          direction: "outbound",
        });
      }

      if (!message && provider && providerMessageId != null) {
        message = await Message.findOne({
          provider,
          providerMessageId,
        });
      }

      if (!message) {
        throw error;
      }

      return { message, isDuplicate: true };
    }
    throw error;
  }
}

async function updateConversationLastMessage(conversationId, text) {
  if (!validateObjectId(conversationId)) {
    return null;
  }

  return Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessageText: text || "",
      lastMessageAt: new Date(),
    },
    { new: true }
  );
}

async function findExistingBotReplyForInbound(conversationId, inboundMessageId) {
  if (
    !validateObjectId(conversationId) ||
    !validateObjectId(inboundMessageId)
  ) {
    return null;
  }

  return Message.findOne({
    conversationId,
    direction: "outbound",
    senderType: "bot",
    $or: [
      { correlationInboundMessageId: inboundMessageId },
      { "metadata.inboundMessageId": inboundMessageId },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();
}

async function handleIncomingCustomerMessage({
  customerPhone,
  text,
  provider = "mock",
  providerMessageId = null,
  metadata = {},
}) {
  const conversation = await findOrCreateOpenConversationByPhone(customerPhone);

  const { message: inboundMessage, isDuplicate: inboundWasDuplicate } =
    await createMessage({
      conversationId: conversation._id,
      direction: "inbound",
      senderType: "customer",
      text,
      provider,
      providerMessageId,
      messageType: "text",
      metadata,
    });

  if (!inboundWasDuplicate) {
    await updateConversationLastMessage(conversation._id, text);
  }

  return {
    conversation,
    inboundMessage,
    inboundWasDuplicate,
  };
}

async function saveBotReply({
  conversationId,
  text,
  provider = "mock",
  metadata = {},
  providerMessageId: providerMessageIdOpt,
}) {
  const correlationInboundMessageId = metadata.inboundMessageId || null;

  const finalMessageId = providerMessageIdOpt || generateMockMessageId();

  const { message: outboundMessage, isDuplicate } = await createMessage({
    conversationId,
    direction: "outbound",
    senderType: "bot",
    text,
    provider,
    providerMessageId: finalMessageId,
    messageType: "text",
    metadata,
    correlationInboundMessageId,
  });

  if (!isDuplicate) {
    await updateConversationLastMessage(conversationId, text);
  }

  return outboundMessage;
}

async function listConversations({
  page = 1,
  limit = 20,
  status,
  mode,
  search,
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
      $regex: escapeRegex(search),
      $options: "i",
    };
  }

  const [items, total] = await Promise.all([
    Conversation.find(filter)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("assignedTo", "name email role status")
      .lean(),
    Conversation.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
}

async function getConversationById(conversationId) {
  if (!validateObjectId(conversationId)) {
    return null;
  }

  return Conversation.findById(conversationId)
    .populate("assignedTo", "name email role status")
    .lean();
}

async function assignConversation({
  conversationId,
  assignedToUserId,
  requestId,
  actorUserId,
}) {
  if (!validateObjectId(conversationId)) {
    throw httpError(400, "VALIDATION_ERROR", "Invalid conversation id");
  }

  if (!validateObjectId(assignedToUserId)) {
    throw httpError(400, "VALIDATION_ERROR", "Invalid assignee user id");
  }

  const assignee = await User.findById(assignedToUserId).select("_id status");

  if (!assignee) {
    throw httpError(404, "ASSIGNEE_NOT_FOUND", "Assignee user not found");
  }

  if (assignee.status !== "active") {
    throw httpError(
      400,
      "ASSIGNEE_INACTIVE",
      "Assignee user is not active and cannot be assigned"
    );
  }

  const updated = await Conversation.findByIdAndUpdate(
    conversationId,
    { assignedTo: assignedToUserId },
    { new: true }
  )
    .populate("assignedTo", "name email role status")
    .lean();

  if (!updated) {
    throw httpError(404, "CONVERSATION_NOT_FOUND", "Conversation not found");
  }

  logger.info(
    {
      requestId,
      actorUserId: actorUserId ? String(actorUserId) : undefined,
      conversationId: String(conversationId),
      assignedToUserId: String(assignedToUserId),
    },
    "Conversation assigned"
  );

  return updated;
}

async function updateConversationMode({ conversationId, mode, requestId }) {
  if (!validateObjectId(conversationId)) {
    throw httpError(400, "VALIDATION_ERROR", "Invalid conversation id");
  }

  const updated = await Conversation.findByIdAndUpdate(
    conversationId,
    { mode },
    { new: true }
  )
    .populate("assignedTo", "name email role status")
    .lean();

  if (!updated) {
    throw httpError(404, "CONVERSATION_NOT_FOUND", "Conversation not found");
  }

  logger.info(
    {
      requestId,
      conversationId: String(conversationId),
      mode,
    },
    "Conversation mode updated"
  );

  return updated;
}

async function updateConversationStatus({
  conversationId,
  status,
  requestId,
}) {
  if (!validateObjectId(conversationId)) {
    throw httpError(400, "VALIDATION_ERROR", "Invalid conversation id");
  }

  let updated;

  try {
    updated = await Conversation.findByIdAndUpdate(
      conversationId,
      { status },
      { new: true }
    )
      .populate("assignedTo", "name email role status")
      .lean();
  } catch (error) {
    if (error.code === 11000) {
      throw httpError(
        409,
        "OPEN_CONVERSATION_CONFLICT",
        "Another open conversation already exists for this customer phone"
      );
    }
    throw error;
  }

  if (!updated) {
    throw httpError(404, "CONVERSATION_NOT_FOUND", "Conversation not found");
  }

  logger.info(
    {
      requestId,
      conversationId: String(conversationId),
      status,
    },
    "Conversation status updated"
  );

  return updated;
}

async function listMessagesByConversationId({
  conversationId,
  page = 1,
  limit = 50,
}) {
  if (!validateObjectId(conversationId)) {
    return null;
  }

  const conversationExists = await Conversation.exists({ _id: conversationId });

  if (!conversationExists) {
    return null;
  }

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const filter = {
    conversationId,
  };

  const [items, total] = await Promise.all([
    Message.find(filter)
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Message.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
}

module.exports = {
  findOrCreateOpenConversationByPhone,
  createMessage,
  updateConversationLastMessage,
  findExistingBotReplyForInbound,
  handleIncomingCustomerMessage,
  saveBotReply,
  listConversations,
  getConversationById,
  listMessagesByConversationId,
  assignConversation,
  updateConversationMode,
  updateConversationStatus,
};
