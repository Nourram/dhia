const express = require('express');
const router = express.Router();

const { participateInExercise } = require('../controllers/participationController');

const { protect } = require('../middleware/authMiddleware');

// ✅ POST - Participate in an exercise (for parents)
router.post('/', protect, participateInExercise);

module.exports = router;
