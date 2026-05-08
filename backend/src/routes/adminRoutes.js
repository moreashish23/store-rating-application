const express = require("express");
const {
  getDashboardStats,
  createUser,
  createStore,
  getUsers,
  getUserById,
  getStores,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(authMiddleware, requireRole("ADMIN"));

router.get("/dashboard", asyncHandler(getDashboardStats));
router.post("/users", asyncHandler(createUser));
router.get("/users", asyncHandler(getUsers));
router.get("/users/:id", asyncHandler(getUserById));
router.post("/stores", asyncHandler(createStore));
router.get("/stores", asyncHandler(getStores));

module.exports = router;