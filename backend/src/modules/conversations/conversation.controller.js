const { z } = require("zod");
const { validateObjectId } = require("../../core/utils/validate-object-id");
const {
  listConversations,
  getConversationById,
  listMessagesByConversationId,
  assignConversation,
  updateConversationMode,
  updateConversationStatus,
  addInternalNoteToConversation,
  updateTicketStatus,
} = require("./conversation.service");

const objectIdString = z
  .string()
  .min(1)
  .refine((id) => validateObjectId(id), {
    message: "Must be a valid MongoDB ObjectId",
  });

const assignBodySchema = z.object({
  assignedTo: objectIdString,
});

const modeBodySchema = z.object({
  mode: z.enum(["human", "bot"]),
});

const statusBodySchema = z.object({
  status: z.enum(["open", "closed"]),
});

const internalNoteBodySchema = z.object({
  note: z.string().trim().min(1).max(8000),
});

const ticketStatusBodySchema = z.object({
  ticketStatus: z.enum(["new", "open", "pending", "resolved", "closed"]),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

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

    if (!validateObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid conversation id",
        requestId: req.requestId,
      });
    }

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

    if (!validateObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid conversation id",
        requestId: req.requestId,
      });
    }

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

async function patchAssignConversation(req, res, next) {
  try {
    const { conversationId } = req.params;

    if (!validateObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid conversation id",
        requestId: req.requestId,
      });
    }

    const parsed = assignBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid assign conversation payload",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId,
      });
    }

    const data = await assignConversation({
      conversationId,
      assignedToUserId: parsed.data.assignedTo,
      requestId: req.requestId,
      actorUserId: req.user._id,
    });

    return res.status(200).json({
      success: true,
      data,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

async function patchConversationMode(req, res, next) {
  try {
    const { conversationId } = req.params;

    if (!validateObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid conversation id",
        requestId: req.requestId,
      });
    }

    const parsed = modeBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid mode payload",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId,
      });
    }

    const data = await updateConversationMode({
      conversationId,
      mode: parsed.data.mode,
      requestId: req.requestId,
    });

    return res.status(200).json({
      success: true,
      data,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

async function patchConversationStatus(req, res, next) {
  try {
    const { conversationId } = req.params;

    if (!validateObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid conversation id",
        requestId: req.requestId,
      });
    }

    const parsed = statusBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid status payload",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId,
      });
    }

    const data = await updateConversationStatus({
      conversationId,
      status: parsed.data.status,
      requestId: req.requestId,
    });

    return res.status(200).json({
      success: true,
      data,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

async function postConversationInternalNote(req, res, next) {
  try {
    const { conversationId } = req.params;

    if (!validateObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid conversation id",
        requestId: req.requestId,
      });
    }

    const parsed = internalNoteBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid internal note payload",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId,
      });
    }

    const data = await addInternalNoteToConversation({
      conversationId,
      note: parsed.data.note,
      authorUserId: req.user._id,
      requestId: req.requestId,
    });

    return res.status(201).json({
      success: true,
      data,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

async function patchConversationTicketStatus(req, res, next) {
  try {
    const { conversationId } = req.params;

    if (!validateObjectId(conversationId)) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid conversation id",
        requestId: req.requestId,
      });
    }

    const parsed = ticketStatusBodySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid ticket status payload",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId,
      });
    }

    const data = await updateTicketStatus({
      conversationId,
      ticketStatus: parsed.data.ticketStatus,
      priority: parsed.data.priority,
      requestId: req.requestId,
    });

    return res.status(200).json({
      success: true,
      data,
      requestId: req.requestId,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getConversations,
  getConversation,
  getConversationMessages,
  patchAssignConversation,
  patchConversationMode,
  patchConversationStatus,
  postConversationInternalNote,
  patchConversationTicketStatus,
};