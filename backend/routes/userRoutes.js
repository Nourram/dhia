const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const Parent = require("../models/parentModel");
const Pedagogue = require("../models/pedagogueModel");
const HealthCare = require("../models/HealthcareProfessional");



// Middleware pour vérifier le token d'authentification
const authMiddleware = require("../middleware/authMiddleware");


// Activer / Désactiver un utilisateur
router.patch("/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Modifier un utilisateur
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userData = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Supprimer un utilisateur
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Récupérer le profil de l'utilisateur connecté
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclure le mot de passe
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Modifier son propre profil
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const { userId, userType } = req.user;

    let user;

    if (userType === "Parent") {
      user = await Parent.findById(userId).select("-password");
    } else if (userType === "Pedagogue") {
      user = await Pedagogue.findById(userId).select("-password");
    } else if (userType === "healthcareprofessional") {
      user = await HealthCare.findById(userId).select("-password");
    }

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Erreur backend (profile):", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Changer le mot de passe
router.post("/change-password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Supprimer son propre compte
router.post("/delete-account", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// GET quiz questions
router.get('/:userId/get-quiz', (req, res) => {
  const quiz = [
    { question: "Quel est le nom de votre première école ?" },
    { question: "Quel est le prénom de votre meilleur ami d'enfance ?" },
  ]

  res.json({ questions: quiz })
})

// POST verify answers
router.post('/verify-quiz', (req, res) => {
  const { userId, answers } = req.body

  // Exemple de bonnes réponses (à remplacer par une vraie base de données)
  const correctAnswers = {
    0: "école primaire abc",
    1: "ahmed"
  }

  const isCorrect = Object.keys(correctAnswers).every(
    (index) =>
      answers[index]?.trim().toLowerCase() === correctAnswers[index].toLowerCase()
  )

  if (isCorrect) {
    res.json({ success: true })
  } else {
    res.json({ success: false })
  }
})




module.exports = router;
