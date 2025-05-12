const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRole');

const {
  createExercise,
  getExercises,
  updateExerciseStatus,
  deleteExercise
} = require('../controllers/exerciseController');

// 🔍 Everyone (logged in): View & search exercises
router.get('/', protect, getExercises);

// ✅ Pedagogue: Create new exercise
router.post('/create', protect, checkRole('Pedagogue'), createExercise);

// 🗑️ Pedagogue: Delete one of their exercises (if not validated)
router.delete('/:id', protect, checkRole('Pedagogue'), deleteExercise);

// 👩‍⚕️ Healthcare: Accept or reject an exercise
router.patch('/:id/status', protect, checkRole('healthcareprofessional'), updateExerciseStatus);

module.exports = router;
