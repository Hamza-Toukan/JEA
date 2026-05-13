const express = require("express");

const {
  getConversations,
  getConversation,
  getConversationMessages,
  patchAssignConversation,
  patchConversationMode,
  patchConversationStatus,
} = require("./conversation.controller");

const { requireAuth, requireRole } = require("../auth/auth.middleware");

const router = express.Router();

router.use(requireAuth);

router.patch(
  "/:conversationId/assign",
  requireRole(["admin"]),
  patchAssignConversation
);

router.use(requireRole(["admin", "supervisor", "agent"]));

router.get("/", getConversations);
router.get("/:conversationId/messages", getConversationMessages);
router.patch("/:conversationId/mode", patchConversationMode);
router.patch("/:conversationId/status", patchConversationStatus);
router.get("/:conversationId", getConversation);

module.exports = router;
