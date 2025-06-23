const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesByChefId,
  markMessageAsRead,
} = require("../controllers/messageController");

router.post("/", sendMessage);
// Definisce la rotta per ottenere i messaggi di un cuoco specifico
router.get("/", getMessagesByChefId);
// Definisce la rotta per marcare un messaggio come letto
router.put("/:id/mark-as-read", markMessageAsRead);

module.exports = router;
