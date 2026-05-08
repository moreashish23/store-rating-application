const express = require("express");
const { getStoreDashboard } = require("../controllers/storeOwnerController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authMiddleware, requireRole("STORE_OWNER"));

router.get("/dashboard", asyncHandler(getStoreDashboard));

module.exports = router;