const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesByChefId,
  markMessageAsRead,
  replyToMessage,
} = require("../controllers/messageController");

router.post("/", sendMessage);
// Definisce la rotta per ottenere i messaggi di un cuoco specifico
router.get("/", getMessagesByChefId);
// Definisce la rotta per marcare un messaggio come letto
router.put("/:id/mark-as-read", markMessageAsRead);
// Definisce la rotta per rispondere a un messaggio
router.post("/reply", replyToMessage);

module.exports = router;
