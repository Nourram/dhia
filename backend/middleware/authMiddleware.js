const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded:", decoded);

    const userId = decoded.userId || decoded.id;

    if (!userId || !decoded.userType) {
      return res.status(401).json({ message: "Invalid token payload (no userId)" });
    }

    req.user = {
      userId,
      userType: decoded.userType,
      email: decoded.email || null
    };

    console.log('🧾 User injected into request:', req.user);
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error);
    return res.status(401).json({
      message: error.name === 'TokenExpiredError'
        ? "Token expired"
        : "Invalid token"
    });
  }
};

module.exports = authMiddleware;
