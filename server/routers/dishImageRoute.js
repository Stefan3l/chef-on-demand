const express = require("express");
const router = express.Router();

const {
  uploadDishImage,
  updateDishImage,
  deleteDishImage,
} = require("../controllers/dishImage");
const verifyToken = require("../middlewares/verifyToken");

// Definisce la rotta per caricare l'immagine di un piatto
router.post("/dishes/upload", verifyToken, uploadDishImage);
// Definisce la rotta per aggiornare un'immagine di un piatto
router.put("/dishes/:id", verifyToken, updateDishImage);
// Definisce la rotta per eliminare un'immagine di un piatto
router.delete("/dishes/:id", verifyToken, deleteDishImage);

module.exports = router;
