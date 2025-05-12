// backend/routes/AdminProfileRoute.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");

// Exemple de données pour le profil admin
const adminData = {
  name: "Admin Name",
  email: "admin@example.com"
};

// Route pour obtenir le profil admin statique
router.get("/", (req, res) => {
  // Vous pouvez ici récupérer les données depuis MongoDB ou une autre source de données
  res.json(adminData);  // Retourne les données du profil admin statique
});

// Route pour obtenir le profil admin par ID
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select("email userType");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
