const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  getAllChefs,
  getMe,
  updateChef,
  deleteChef,
  getChefByPreviewUrl,
} = require("../controllers/chefController");
const verifyToken = require("../middlewares/verifyToken");

// Definisce la rotta per ottenere tutti i cuochi
router.get("/", getAllChefs);
router.get("/me", verifyToken, getMe); // Definisce la rotta per ottenere i dettagli del cuoco autenticato, protetta
router.put("/me", upload.single("profileImage"), verifyToken, updateChef); // Definisce la rotta per aggiornare i dettagli del cuoco autenticato, protetta
router.delete("/:id", verifyToken, deleteChef); // Definisce la rotta per eliminare un cuoco, protetta
router.get("/preview/:previewUrl", getChefByPreviewUrl); // Definisce la rotta per ottenere un cuoco tramite previewUrl
module.exports = router;
