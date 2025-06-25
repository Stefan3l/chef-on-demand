const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  getAllChefs,
  getMe,
  updateChef,
  deleteChef,
  getChefByPreviewParam,
  getChefById,
} = require("../controllers/chefController");
const verifyToken = require("../middlewares/verifyToken");

// Definisce la rotta per ottenere tutti i cuochi
router.get("/", getAllChefs);
router.get("/me", verifyToken, getMe); // Definisce la rotta per ottenere i dettagli del cuoco autenticato, protetta
router.put("/me", upload.single("profileImage"), verifyToken, updateChef); // Definisce la rotta per aggiornare i dettagli del cuoco autenticato, protetta
router.delete("/:id", verifyToken, deleteChef); // Definisce la rotta per eliminare un cuoco, protetta
router.get("/preview/:previewUrl", getChefByPreviewParam); // Definisce la rotta per ottenere un cuoco tramite previewUrl
router.get("/:id", getChefById); // Definisce la rotta per ottenere un cuoco tramite ID
module.exports = router;
