const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["convert", "debug", "codeQuality"],
      required: [true, "Review type is required"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "Code content is required"],
    },
    language: {
      type: String,
      default: "javascript",
    },
    inputLanguage: {
      type: String,
      default: null,
    },
    outputLanguage: {
      type: String,
      default: null,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Analysis result is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
