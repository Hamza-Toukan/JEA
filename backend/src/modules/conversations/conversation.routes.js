const express = require("express");
const {
  getConversations,
  getConversation,
  getConversationMessages
} = require("./conversation.controller");

const router = express.Router();

router.get("/", getConversations);
router.get("/:conversationId", getConversation);
router.get("/:conversationId/messages", getConversationMessages);

module.exports = router;