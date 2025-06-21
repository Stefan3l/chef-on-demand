const express = require("express");
const router = express.Router();
const { loginChef } = require("../controllers/authController");

router.post("/login", loginChef);

module.exports = router;
