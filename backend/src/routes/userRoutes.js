const express = require("express");
const { getStores, submitRating, updateRating } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authMiddleware, requireRole("USER"));

router.get("/stores", asyncHandler(getStores));
router.post("/ratings", asyncHandler(submitRating));
router.put("/ratings/:storeId", asyncHandler(updateRating));

module.exports = router;