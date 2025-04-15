const Participation = require('../models/Participation');
const Exercise = require('../models/Exercise');

// ✅ Score generator
const generateScore = (difficulty) => {
  const base = difficulty * 20; // e.g. difficulty 3 = 60
  return Math.floor(base + Math.random() * 20); // Add up to +20
};

// ✅ POST: Child participates in an exercise
const participateInExercise = async (req, res) => {
  try {
    const { childId, exerciseId } = req.body;

    const exercise = await Exercise.findById(exerciseId);
    if (!exercise || exercise.status !== 'accepted') {
      return res.status(404).json({ message: 'Exercise not found or not accepted' });
    }

    const score = generateScore(exercise.difficulty); // 👉 Ici on l’utilise

    const participation = new Participation({
      childId,
      exerciseId,
      score
    });

    await participation.save();

    res.status(201).json({ message: 'Exercise completed', score, participation });
  } catch (error) {
    console.error('❌ Error in participation:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  participateInExercise
};
