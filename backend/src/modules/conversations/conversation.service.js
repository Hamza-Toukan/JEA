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

module.exports = {
  findOrCreateOpenConversationByPhone,
  createMessage,
  updateConversationLastMessage,
  handleIncomingCustomerMessage,
  saveBotReply
};