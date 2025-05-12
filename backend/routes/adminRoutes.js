const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin"); // Make sure this is pointing to the correct file (e.g., '../models/admin')
const {
  authMiddleware,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  submitFeedback,
  getAllFeedback,
} = require("../controllers/FeedbackController");

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, userType: admin.userType },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get admin ID
router.get("/admin-id", async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ adminId: admin._id });
  } catch (error) {
    console.error("Error fetching admin ID:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
