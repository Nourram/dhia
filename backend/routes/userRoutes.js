const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware/authMiddleware");
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
    // Validate input - allow partial updates, only check if fields are present
    if (firstName !== undefined && !firstName) {
      return res.status(400).json({ message: "First name cannot be empty" });
    }
    if (lastName !== undefined && !lastName) {
      return res.status(400).json({ message: "Last name cannot be empty" });
    }
    if (email !== undefined && !email) {
      return res.status(400).json({ message: "Email cannot be empty" });
    }

    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (email !== undefined) updateData.email = email;
    if (userType !== undefined) updateData.userType = userType;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
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
router.post('/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'Try again' });

    // ⚠️ Si on vient du quiz, currentPassword peut être '[verified]'
    if (currentPassword !== '[verified]') {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect Current password' });
      }
    }

    // 🔐 Hasher et enregistrer le nouveau mot de passe
    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Passwoed updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error server' });
  }
});

router.post("/delete-account", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Failed to delete account" });
  }
});


router.get('/:userId/get-quiz', authMiddleware, async (req, res) => {
  try {
    console.log('🔍 Requested User ID:', req.params.userId);

    if (!req.params.userId) {
      return res.status(400).json({ message: 'User ID missing' });
    }

    const user = await User.findById(req.params.userId).select('securityQuiz');
    console.log('✅ Fetched user:', user);

    if (!user || !user.securityQuiz || !user.securityQuiz.length) {
      return res.status(404).json({ message: 'No quiz found' });
    }

    const quiz = user.securityQuiz.map((item) => ({ question: item.question }));
    res.json({ questions: quiz });
  } catch (error) {
    console.error('🔥 Error fetching quiz:', error.message);
    res.status(500).json({ message: error.message || 'Failed to fetch quiz' });
  }
});





// Verify quiz answers (dynamic implementation needed)
router.post("/verify-quiz", authMiddleware, async (req, res) => {
  const { userId, answers } = req.body;

  try {
    const user = await User.findById(userId).select('securityQuiz securityQuizPassed');
    if (!user || !user.securityQuiz.length) {
      return res.status(404).json({ message: 'No quiz found' });
    }

    const correctAnswers = user.securityQuiz;

    const isCorrect = correctAnswers.every((q, i) =>
      answers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase()
    );

    if (isCorrect && !user.securityQuizPassed) {
      user.securityQuizPassed = true;
      await user.save();
    }

    res.json({ success: isCorrect });
  } catch (error) {
    console.error("Error verifying quiz:", error);
    res.status(500).json({ message: "Failed to verify quiz" });
  }
});
router.post('/:userId/setup-quiz', async (req, res) => {
  const { quiz } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { securityQuiz: quiz },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving quiz' });
  }
});


module.exports = router;