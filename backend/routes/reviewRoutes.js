const express = require("express");
const router = express.Router();
const {
  convertCode,
  debugCode,
  qualityCheck,
  getMyReviews,
  getMyStats,
  getReviewById,
  deleteReview,
} = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// All review routes require authentication
router.use(authMiddleware);

// AI Trigger routes (also mounted via /api/reviews and /api for convenience)
router.post("/convert", convertCode);
router.post("/debug", debugCode);
router.post("/codeQuality", qualityCheck);

// User review history & stats
router.get("/my", getMyReviews);
router.get("/stats", getMyStats);
router.get("/:id", getReviewById);
router.delete("/:id", deleteReview);

module.exports = router;
