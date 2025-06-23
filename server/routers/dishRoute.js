const express = require("express");
const router = express.Router();

const {
  uploadDishImage,
  updateDishImage,
  deleteDishImage,
  getAllDishes,
} = require("../controllers/dish");
const verifyToken = require("../middlewares/verifyToken");

// Definisce la rotta per caricare l'immagine di un piatto
router.post("/dishes/upload", verifyToken, uploadDishImage);
// Definisce la rotta per aggiornare un'immagine di un piatto
router.put("/dishes/:id", verifyToken, updateDishImage);
// Definisce la rotta per eliminare un'immagine di un piatto
router.delete("/dishes/:id", verifyToken, deleteDishImage);
// Definisce la rotta per ottenere tutti i piatti con filtri
router.get("/dishes", verifyToken, getAllDishes);

module.exports = router;
