const { z } = require("zod");
const {
  processIncomingMessage,
} = require("../../../orchestration/conversation-orchestrator.service");
const { logger } = require("../../../../core/logger/logger");

const mockIncomingSchema = z.object({
  from: z.string().min(5, "from is required"),
  text: z.string().optional().default(""),
  messageId: z.string().optional(),
});

async function receiveMockIncomingMessage(req, res, next) {
  try {
    const parsed = mockIncomingSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Invalid mock WhatsApp payload",
        details: z.flattenError(parsed.error).fieldErrors,
        requestId: req.requestId,
      });
    }

    const { from, text, messageId } = parsed.data;

    logger.info(
      {
        requestId: req.requestId,
        from,
        hasText: Boolean(text),
        provider: "mock",
        messageId: messageId || null,
      },
      "Mock WhatsApp incoming message received",
    );

    const result = await processIncomingMessage({
      from,
      text,
      provider: "mock",
      providerMessageId:
        messageId ||
        `mock_in_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      metadata: {
        rawPayload: req.body,
      },
    });

    return res.status(200).json({
      success: true,
      conversationId: result.conversation._id,
      inboundMessageId: result.inboundMessage._id,
      outboundMessageId: result.outboundMessage
        ? result.outboundMessage._id
        : null,
      reply: result.replyText,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  receiveMockIncomingMessage,
};
