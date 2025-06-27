const express = require("express");
const router = express.Router();
const {
  createMenu,
  getAllMenus,
  getMenuById,
  deleteMenu,
  getMenus,
  reorderMenuItems,
  getMenuItemsByChef,
} = require("../controllers/menuController");

const verifyToken = require("../middlewares/verifyToken");

router.post("/menus", verifyToken, createMenu);

router.get("/menus", getAllMenus);

router.get("/menus/:id", verifyToken, getMenuById);

router.delete("/menus/:id", verifyToken, deleteMenu);
router.get("/chef/menus", verifyToken, getMenus);

router.patch("/menus/:id/reorder", verifyToken, reorderMenuItems);
router.get("/menu-items", verifyToken, getMenuItemsByChef);

module.exports = router;
