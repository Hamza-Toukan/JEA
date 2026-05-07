const express = require("express");

const {
  getConversations,
  getConversation,
  getConversationMessages
} = require("./conversation.controller");

const { requireAuth, requireRole } = require("../auth/auth.middleware");

const router = express.Router();

router.use(requireAuth);
router.use(requireRole(["admin", "supervisor", "agent"]));

router.get("/", getConversations);
router.get("/:conversationId", getConversation);
router.get("/:conversationId/messages", getConversationMessages);

module.exports = router;