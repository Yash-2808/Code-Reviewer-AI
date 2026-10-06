const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access denied. No authentication token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "Access denied. Authentication token missing.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("CRITICAL: JWT_SECRET environment variable is not defined.");
      return res.status(500).json({ error: "Server authentication configuration error." });
    }

    const decoded = jwt.verify(token, jwtSecret);

    req.user = {
      userId: decoded.userId,
      role: decoded.role || "user",
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Session expired. Please log in again.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      error: "Invalid authentication token.",
      code: "INVALID_TOKEN",
    });
  }
};

module.exports = authMiddleware;
