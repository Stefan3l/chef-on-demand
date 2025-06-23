const express = require("express");
const router = express.Router();
const {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} = require("../controllers/menuController");

// Definisce la rotta per creare un nuovo menu
router.post("/menus", createMenu);
// Definisce la rotta per ottenere tutti i menu
router.get("/menus", getAllMenus);
// Definisce la rotta per ottenere un menu specifico per ID
router.get("/menus/:id", getMenuById);
// Definisce la rotta per aggiornare un menu specifico per ID
router.put("/menus/:id", updateMenu);
// Definisce la rotta per eliminare un menu specifico per ID
router.delete("/menus/:id", deleteMenu);

module.exports = router;
