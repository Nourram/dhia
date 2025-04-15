// backend/routes/AdminProfileRoute.js
const express = require("express");
const router = express.Router();

// Exemple de données pour le profil admin
const adminData = {
  name: "Admin Name",
  email: "admin@example.com"
};

// Route pour obtenir le profil admin
router.get("/", (req, res) => {
  // Vous pouvez ici récupérer les données depuis MongoDB ou une autre source de données
  res.json(adminData);  // Retourne les données du profil admin
});

module.exports = router;
