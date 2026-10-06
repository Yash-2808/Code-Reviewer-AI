const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "Access denied. Administrator privileges required.",
      code: "FORBIDDEN_ADMIN_ONLY",
    });
  }
  next();
};

module.exports = adminMiddleware;
