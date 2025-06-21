const express = require("express");
const router = express.Router();
const {
  loginChef,
  createChef,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/login", loginChef);
router.post("/", createChef);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
module.exports = router;
