const express = require("express");
const router = express.Router();
const {
  getAllChefs,

  getMe,
  updateChef,
  deleteChef,
} = require("../controllers/chefController");
const verifyToken = require("../middlewares/verifyToken");

// Definisce la rotta per ottenere tutti i cuochi
router.get("/", getAllChefs);
router.get("/me", verifyToken, getMe); // Definisce la rotta per ottenere i dettagli del cuoco autenticato, protetta
router.put("/me", verifyToken, updateChef); // Definisce la rotta per aggiornare i dettagli del cuoco autenticato, protetta
router.delete("/:id", verifyToken, deleteChef); // Definisce la rotta per eliminare un cuoco, protetta
module.exports = router;
