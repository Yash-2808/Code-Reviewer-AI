const path = require("path");
const fs = require("fs");
require("dotenv").config();
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
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

// API Health Check Route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Code Reviewer AI Backend API is healthy 🚀" });
});

// Mount modular API routes
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Protected root endpoints for backward compatibility with existing frontend calls
app.post("/convert", authMiddleware, convertCode);
app.post("/debug", authMiddleware, debugCode);
app.post("/codeQuality", authMiddleware, qualityCheck);

// Serve Frontend static production assets if built
const frontendDistPath = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));

  // Catch-all route to serve SPA frontend index.html for client-side routing
  app.get("*", (req, res, next) => {
    // If request starts with /api or known endpoints, skip to 404
    if (
      req.path.startsWith("/api") ||
      req.path === "/convert" ||
      req.path === "/debug" ||
      req.path === "/codeQuality"
    ) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
} else {
  // If frontend is not built, root welcome message
  app.get("/", (req, res) => {
    res.send("Welcome to the Code Reviewer AI Backend API 🎉 (Powered by Google Gemini & MongoDB)");
  });
}

// 404 Handler for undefined API routes
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
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT} (0.0.0.0)`);
});
