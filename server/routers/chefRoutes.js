const express = require("express");
const router = express.Router();
const { getAllChefs } = require("../controllers/chefController");

// Definisce la rotta per ottenere tutti i cuochi
router.get("/", getAllChefs);

module.exports = router;
