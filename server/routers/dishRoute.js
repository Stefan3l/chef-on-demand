const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  uploadDishImage,
  updateDishImage,
  deleteDishImage,
  getAllDishes,
} = require("../controllers/dish");
const verifyToken = require("../middlewares/verifyToken");

// Definisce la rotta per caricare l'immagine di un piatto
router.post(
  "/dishes/upload",
  upload.single("dishImage"),
  verifyToken,
  uploadDishImage
);
// Definisce la rotta per aggiornare un'immagine di un piatto
router.put("/dishes/:id", upload.single("image"), verifyToken, updateDishImage);
// Definisce la rotta per eliminare un'immagine di un piatto
router.delete("/dishes/:id", verifyToken, deleteDishImage);
// Definisce la rotta per ottenere tutti i piatti con filtri
router.get("/dishes", verifyToken, getAllDishes);

module.exports = router;
