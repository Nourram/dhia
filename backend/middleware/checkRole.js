module.exports = (requiredRole) => (req, res, next) => {
  if (req.user?.userType?.toLowerCase() !== requiredRole.toLowerCase()) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  next();
};
