const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const Parent = require("../models/parentModel");
const Pedagogue = require("../models/pedagogueModel");
const HealthCare = require("../models/HealthcareProfessional");

// Get all users (for admin)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Assuming only admins can access this route (add role check in authMiddleware if needed)
    const users = await User.find().select("firstName email userType status");
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// Get authenticated user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { userId, userType } = req.user;
    let user;

    switch (userType) {
      case "Parent":
        user = await Parent.findById(userId).select("-password");
        break;
      case "Pedagogue":
        user = await Pedagogue.findById(userId).select("-password");
        break;
      case "HealthcareProfessional":
        user = await HealthCare.findById(userId).select("-password");
        break;
      default:
        user = await User.findById(userId).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Update user status (admin only)
router.patch("/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Add role check in authMiddleware to ensure only admins can update status
    const user = await User.findByIdAndUpdate(
      id,
      { status: Boolean(status) },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(400).json({ message: "Failed to update user status" });
  }
});

// Update user (admin or self)
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, userType } = req.body;

  try {
    // Validate input
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, email, userType },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ message: "Failed to update user" });
  }
});

// Delete user (admin or self)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Change password
router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both passwords are required" });
    }

    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Failed to change password" });
  }
});

// Delete own account
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
});

// Get quiz questions (dynamic implementation needed)
router.get("/:userId/get-quiz", authMiddleware, async (req, res) => {
  try {
    // TODO: Fetch questions from a secure database based on userId
    const quiz = [
      { question: "What was the name of your first school?" },
      { question: "What is the name of your childhood best friend?" },
    ];
    res.json({ questions: quiz });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
});

// Verify quiz answers (dynamic implementation needed)
router.post("/verify-quiz", authMiddleware, async (req, res) => {
  const { userId, answers } = req.body;

  try {
    // TODO: Fetch correct answers from a secure database
    const correctAnswers = {
      0: "Primary School ABC", // Example
      1: "Ahmed", // Example
    };

    const isCorrect = Object.keys(correctAnswers).every(
      (index) =>
        answers[index]?.trim().toLowerCase() ===
        correctAnswers[index].toLowerCase()
    );

    res.json({ success: isCorrect });
  } catch (error) {
    console.error("Error verifying quiz:", error);
    res.status(500).json({ message: "Failed to verify quiz" });
  }
});

module.exports = router;