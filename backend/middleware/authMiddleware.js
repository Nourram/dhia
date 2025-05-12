// const jwt = require("jsonwebtoken"); 

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("✅ Token decoded:", decoded);

//     const userId = decoded.userId || decoded.id;

//     if (!userId || !decoded.userType) {
//       return res.status(401).json({ message: "Invalid token payload (no userId)" });
//     }

//     req.user = {
//       userId,
//       userType: decoded.userType,
//       email: decoded.email || null
//     };

//     console.log('🧾 User injected into request:', req.user);
//     next();
//   } catch (error) {
//     console.error('❌ Token verification error:', error);
//     return res.status(401).json({
//       message: error.name === 'TokenExpiredError'
//         ? "Token expired"
//         : "Invalid token"
//     });
//   }
// };

// const authorizeRole = (roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.userType)) {
//       return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
//     }
//     next();
//   };
// };

// module.exports ={ authMiddleware, authorizeRole};


const jwt = require("jsonwebtoken");

// Middleware to protect routes (authentication)
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
const protect = (req, res, next) => {
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

// Middleware to authorize based on roles (authorization)
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.userType)) {
      console.warn(`🚫 Access denied for userType: ${req.user.userType}`);
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
};

module.exports = { protect, authorize,authMiddleware };
