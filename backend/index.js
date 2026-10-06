const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Import controllers and middleware for root endpoints
const {
  convertCode,
  debugCode,
  qualityCheck,
} = require("./controllers/reviewController");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root Health Check Route
app.get("/", (req, res) => {
  res.send("Welcome to the Code Reviewer AI Backend API 🎉 (Powered by Google Gemini & MongoDB)");
});

// Mount modular API routes
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Protected root endpoints for backward compatibility with existing frontend calls
app.post("/convert", authMiddleware, convertCode);
app.post("/debug", authMiddleware, debugCode);
app.post("/codeQuality", authMiddleware, qualityCheck);

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Centralized Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || "An internal server error occurred.",
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
