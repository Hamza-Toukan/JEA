const { z } = require("zod");
const {
  listConversations,
  getConversationById,
  listMessagesByConversationId
} = require("./conversation.service");

const listConversationsQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(20),
  status: z.enum(["open", "closed"]).optional(),
  mode: z.enum(["bot", "human"]).optional(),
  search: z.string().optional()
});

const listMessagesQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(50)
});

async function getConversations(req, res, next) {
  try {
    const parsed = listConversationsQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid conversations query parameters",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId
      });
    }

    const result = await listConversations(parsed.data);

    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      requestId: req.requestId
    });
  } catch (error) {
    next(error);
  }
}

async function getConversation(req, res, next) {
  try {
    const { conversationId } = req.params;

    const conversation = await getConversationById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        code: "CONVERSATION_NOT_FOUND",
        message: "Conversation not found",
        requestId: req.requestId
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
      requestId: req.requestId
    });
  } catch (error) {
    next(error);
  }
}

async function getConversationMessages(req, res, next) {
  try {
    const { conversationId } = req.params;

    const parsed = listMessagesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid messages query parameters",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId
      });
    }

    const result = await listMessagesByConversationId({
      conversationId,
      ...parsed.data
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        code: "CONVERSATION_NOT_FOUND",
        message: "Conversation not found",
        requestId: req.requestId
      });
    }

    return res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
      requestId: req.requestId
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConversations,
  getConversation,
  getConversationMessages
};