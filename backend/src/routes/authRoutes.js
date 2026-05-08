const express = require("express");
const { register, login, changePassword, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/change-password", authMiddleware, asyncHandler(changePassword));
router.get("/me", authMiddleware, asyncHandler(getMe));

module.exports = router;