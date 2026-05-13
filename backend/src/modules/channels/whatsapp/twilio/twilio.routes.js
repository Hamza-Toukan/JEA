const express = require("express");
const { handleTwilioWebhook } = require("./twilio.controller");

const router = express.Router();

router.post("/webhook", handleTwilioWebhook);

module.exports = router;
