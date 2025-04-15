const express = require('express');
const router = express.Router();

const { participateInExercise } = require('../controllers/participationController');

const verifyToken = require('../middleware/authMiddleware');

// ✅ POST - Participate in an exercise (for parents)
router.post('/', verifyToken, participateInExercise);

module.exports = router;
