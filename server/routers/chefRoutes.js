const express = require("express");
const router = express.Router();
const { getAllChefs, createChef } = require("../controllers/chefController");

// Definisce la rotta per ottenere tutti i cuochi
router.get("/", getAllChefs);
router.post("/", createChef);

module.exports = router;
