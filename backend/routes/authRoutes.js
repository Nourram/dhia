const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, loginUser } = require('../controllers/authController');
const { login } = require('../controllers/AdminControllers');  // Correction du nom du fichier ici

// Route pour la connexion admin ou user
router.post('/login', login);  // Une seule route pour la connexion
// Route pour l'inscription admin
router.post('/admin/register', registerAdmin);


// Route pour la connexion admin
router.post('/admin/login', loginAdmin);

// Route pour la connexion utilisateur
router.post('/login', loginUser);


module.exports = router;