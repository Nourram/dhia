const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const {
  createExercise,
  getExercises,
  updateExerciseStatus,
  deleteExercise
} = require('../controllers/exerciseController');

// 🔍 Everyone (logged in): View & search exercises
router.get('/', verifyToken, getExercises);

// ✅ Pedagogue: Create new exercise
router.post('/', verifyToken, checkRole('Pedagogue'), createExercise);

// 🗑️ Pedagogue: Delete one of their exercises
router.delete('/:id', verifyToken, checkRole('Pedagogue'), deleteExercise);

// 👩‍⚕️ Healthcare: Accept or reject an exercise
router.patch('/:id/status', verifyToken, checkRole('healthcareprofessional'), updateExerciseStatus);

module.exports = router;
