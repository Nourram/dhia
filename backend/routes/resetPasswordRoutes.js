const express = require('express');
const router = express.Router();
const { sendResetCode, verifyResetCode, resetPassword } = require('../controllers/authController');

// Envoie du code
router.post('/forgot-password', sendResetCode);

// Vérification du code
router.post('/verify-code', verifyResetCode);

// Réinitialisation du mot de passe
router.post('/reset-password', resetPassword);

module.exports = router;
