const express = require("express");
const router = express.Router();
const {
  createMenu,
  getAllMenus,
  getMenuById,
  deleteMenu,
} = require("../controllers/menuController");

const verifyToken = require("../middlewares/verifyToken");

router.post("/menus", verifyToken, createMenu);

router.get("/menus", getAllMenus);

router.get("/menus/:id", getMenuById);

router.delete("/menus/:id", verifyToken, deleteMenu);

module.exports = router;
