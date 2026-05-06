const express = require("express");
const { receiveMockIncomingMessage } = require("./mock-whatsapp.controller");

const router = express.Router();

router.post("/incoming", receiveMockIncomingMessage);

module.exports = router;