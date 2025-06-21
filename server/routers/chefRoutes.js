const express = require("express");
const router = express.Router();
const {
  getAllChefs,
  createChef,
  getMe,
  updateChef,
} = require("../controllers/chefController");
const verifyToken = require("../middlewares/verifyToken");

// Definisce la rotta per ottenere tutti i cuochi
router.get("/", getAllChefs);
router.post("/", createChef);
router.get("/me", verifyToken, getMe); // Definisce la rotta per ottenere i dettagli del cuoco autenticato, protetta
router.put("/me", verifyToken, updateChef); // Definisce la rotta per aggiornare i dettagli del cuoco autenticato, protetta
module.exports = router;
