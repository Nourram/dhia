const express = require('express');
const router = express.Router();
const { registerPedagogue } = require('../controllers/PedagogueController');

// ✅ POST /api/pedagogue/signup
router.post('/signup', registerPedagogue);

module.exports = router;
