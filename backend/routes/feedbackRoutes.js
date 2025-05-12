const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedback } = require('../controllers/FeedbackController');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

// 📩 Route pour que les utilisateurs puissent envoyer un feedback
router.post('/feedback', authMiddleware, submitFeedback);

// 📋 Route pour que l'admin puisse voir tous les feedbacks
router.get('/feedback', authMiddleware, authorize(['admin']), getAllFeedback);

module.exports = router;
