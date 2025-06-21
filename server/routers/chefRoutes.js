const express = require("express");
const router = express.Router();
const {
  getAllChefs,
  createChef,
  getMe,
} = require("../controllers/chefController");
const verifyToken = require("../middlewares/verifyToken");

// Definisce la rotta per ottenere tutti i cuochi
router.get("/", getAllChefs);
router.post("/", createChef);
router.get("/me", verifyToken, getMe); // Definisce la rotta per ottenere i dettagli del cuoco autenticato, protetta

module.exports = router;
