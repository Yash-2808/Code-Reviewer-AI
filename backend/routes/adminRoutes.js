const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// All admin routes require authentication and admin role authorization
router.use(authMiddleware, adminMiddleware);

/**
 * @route   GET /api/admin/stats
 * @desc    Get overall system platform statistics
 * @access  Admin only
 */
router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const convertCount = await Review.countDocuments({ type: "convert" });
    const debugCount = await Review.countDocuments({ type: "debug" });
    const qualityCount = await Review.countDocuments({ type: "codeQuality" });

    res.status(200).json({
      platformStats: {
        totalUsers,
        totalReviews,
        breakdown: {
          convert: convertCount,
          debug: debugCount,
          codeQuality: qualityCount,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admin stats." });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get list of all registered users
 * @access  Admin only
 */
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

/**
 * @route   GET /api/admin/reviews
 * @desc    Get recent reviews across all users
 * @access  Admin only
 */
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch platform reviews." });
  }
});

module.exports = router;
