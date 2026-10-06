const mongoose = require("mongoose");
const Review = require("../models/Review");
const {
  convertCodeService,
  debugCodeService,
  qualityCheckService,
} = require("../services/geminiService");

/**
 * @route   POST /api/convert (or /convert)
 * @desc    Convert code to another language and persist review for authenticated user
 * @access  Private
 */
const convertCode = async (req, res) => {
  try {
    const { code, fromLanguage, toLanguage } = req.body;
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Code is required for conversion." });
    }
    if (!toLanguage) {
      return res.status(400).json({ error: "Target language (toLanguage) is required." });
    }

    const customApiKey = req.headers["x-api-key"];
    const convertedCode = await convertCodeService(
      code,
      fromLanguage,
      toLanguage,
      customApiKey
    );

    // Persist review associated with the authenticated user
    const review = await Review.create({
      userId: req.user.userId,
      type: "convert",
      code,
      language: fromLanguage || "auto-detect",
      inputLanguage: fromLanguage || "auto-detect",
      outputLanguage: toLanguage,
      result: { convertedCode },
    });

    return res.status(200).json({
      convertedCode,
      reviewId: review._id.toString(),
    });
  } catch (error) {
    console.error("Convert Error:", error.message);
    if (error.message === "API_KEY_MISSING") {
      return res.status(401).json({
        error: "Gemini API key is missing. Please set it in the backend .env or provide it in the frontend settings.",
      });
    }
    return res.status(500).json({
      error: error.message || "Something went wrong during conversion.",
    });
  }
};

/**
 * @route   POST /api/debug (or /debug)
 * @desc    Debug code, detect errors, and persist review for authenticated user
 * @access  Private
 */
const debugCode = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Code is required for debugging." });
    }

    const customApiKey = req.headers["x-api-key"];
    const debugInfo = await debugCodeService(code, customApiKey);

    // Persist review associated with the authenticated user
    const review = await Review.create({
      userId: req.user.userId,
      type: "debug",
      code,
      language: language || "javascript",
      result: { debugInfo },
    });

    return res.status(200).json({
      debugInfo,
      reviewId: review._id.toString(),
    });
  } catch (error) {
    console.error("Debug Error:", error.message);
    if (error.message === "API_KEY_MISSING") {
      return res.status(401).json({
        error: "Gemini API key is missing. Please set it in the backend .env or provide it in the frontend settings.",
      });
    }
    return res.status(500).json({
      error: error.message || "Something went wrong during debugging.",
    });
  }
};

/**
 * @route   POST /api/codeQuality (or /codeQuality)
 * @desc    Analyze code quality, performance, security, and persist review
 * @access  Private
 */
const qualityCheck = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ error: "Code is required for quality analysis." });
    }

    const customApiKey = req.headers["x-api-key"];
    const qualityReport = await qualityCheckService(code, customApiKey);

    // Persist review associated with the authenticated user
    const review = await Review.create({
      userId: req.user.userId,
      type: "codeQuality",
      code,
      language: language || "javascript",
      result: { qualityReport },
    });

    return res.status(200).json({
      qualityReport,
      reviewId: review._id.toString(),
    });
  } catch (error) {
    console.error("Quality Check Error:", error.message);
    if (error.message === "API_KEY_MISSING") {
      return res.status(401).json({
        error: "Gemini API key is missing. Please set it in the backend .env or provide it in the frontend settings.",
      });
    }
    return res.status(500).json({
      error: error.message || "Something went wrong during quality check.",
    });
  }
};

/**
 * @route   GET /api/reviews/my
 * @desc    Get all reviews belonging exclusively to the authenticated user
 * @access  Private
 */
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ reviews });
  } catch (error) {
    console.error("GetMyReviews Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch your reviews." });
  }
};

/**
 * @route   GET /api/reviews/stats
 * @desc    Get statistics for the authenticated user's private dashboard
 * @access  Private
 */
const getMyStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const total = await Review.countDocuments({ userId });
    const convertCount = await Review.countDocuments({ userId, type: "convert" });
    const debugCount = await Review.countDocuments({ userId, type: "debug" });
    const qualityCount = await Review.countDocuments({ userId, type: "codeQuality" });

    return res.status(200).json({
      stats: {
        total,
        convert: convertCount,
        debug: debugCount,
        codeQuality: qualityCount,
      },
    });
  } catch (error) {
    console.error("GetMyStats Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch user review statistics." });
  }
};

/**
 * @route   GET /api/reviews/:id
 * @desc    Get an individual review with strict ownership authorization
 * @access  Private
 */
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID format." });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Strict Authorization Check: User can only access their own review
    if (review.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        error: "Access denied. You do not have permission to view this review.",
        code: "FORBIDDEN_NOT_OWNER",
      });
    }

    return res.status(200).json({ review });
  } catch (error) {
    console.error("GetReviewById Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch review details." });
  }
};

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete an individual review with strict ownership authorization
 * @access  Private
 */
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID format." });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found." });
    }

    // Strict Authorization Check: User can only delete their own review
    if (review.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        error: "Access denied. You do not have permission to delete this review.",
        code: "FORBIDDEN_NOT_OWNER",
      });
    }

    await Review.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Review deleted successfully.",
      id,
    });
  } catch (error) {
    console.error("DeleteReview Error:", error.message);
    return res.status(500).json({ error: "Failed to delete review." });
  }
};

module.exports = {
  convertCode,
  debugCode,
  qualityCheck,
  getMyReviews,
  getMyStats,
  getReviewById,
  deleteReview,
};
