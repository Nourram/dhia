const Exercise = require('../models/Exercise');

const createExercise = async (req, res) => {
  try {
    console.log('Creating exercise with data:', req.body);
    console.log('User data:', req.user);
    
    const { title, description, type, difficulty, expectedOutcome, scoreLogic } = req.body;

    if (!['cognitive', 'motor', 'social'].includes(type)) {
      return res.status(400).json({ message: 'Invalid exercise type' });
    }

    // Vérifier si l'utilisateur est un pédagogue
    if (req.user.userType !== 'Pedagogue') {
      console.log('User type:', req.user.userType);
      console.log('User ID:', req.user.userId);
      return res.status(403).json({ 
        message: 'Only pedagogues can create exercises',
        userType: req.user.userType
      });
    }

    // Vérifier si nous avons l'ID de l'utilisateur
    if (!req.user.userId) {
      console.error('No user ID found in request');
      return res.status(500).json({ message: 'User ID not found in token' });
    }

    const newExercise = new Exercise({
      title,
      description,
      type,
      difficulty,
      expectedOutcome,
      scoreLogic,
      createdBy: req.user.userId,
      createdByModel: 'Pedagogue',
      status: 'pending' // Set initial status as pending
    });

    console.log('New exercise object:', newExercise);
    
    await newExercise.save();
    console.log('Exercise saved successfully');

    res.status(201).json({ message: 'Exercise created', exercise: newExercise });
  } catch (err) {
    console.error('❌ Error creating exercise:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getExercises = async (req, res) => {
  try {
    console.log('👤 User:', req.user);

    const { type, difficulty, search, status } = req.query;
    let query = {};

    // 🔐 Role-based filtering
    if (req.user.userType === 'parent') {
      query.status = 'accepted';
    } else if (req.user.userType === 'Pedagogue') {
      query.createdBy = req.user.userId;
    } else if (req.user.userType === 'healthcareprofessional') {
      query.status = 'pending'; // ✅ Important for review
    }

    // ✅ Override by query param (if needed)
    if (status) query.status = status;
    if (type) query.type = type;
    if (difficulty) query.difficulty = parseInt(difficulty);
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('📦 Final query:', query);

    const exercises = await Exercise.find(query)
  .sort({ createdAt: -1 })
  .populate({
    path: 'createdBy',
    select: 'nom prenom',
    model: doc => doc.createdByModel // ← dynamique
  })

    res.status(200).json(exercises);
  } catch (err) {
    console.error('❌ Error fetching exercises:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


const updateExerciseStatus = async (req, res) => {
  try {
    console.log('Updating exercise status:', req.params.id);
    console.log('Update data:', req.body);
    console.log('User data:', req.user);

    const { status, rejectionReason } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Verify user is a healthcare professional
    if (req.user.userType !== 'healthcareprofessional') {
      return res.status(403).json({ 
        message: 'Only healthcare professionals can approve/reject exercises',
        userType: req.user.userType
      });
    }

    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      console.log('Exercise not found:', req.params.id);
      return res.status(404).json({ message: 'Exercise not found' });
    }

    // Validate rejection reason
    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    exercise.status = status;
    exercise.approvedBy = req.user.userId;
    exercise.approvedByModel = 'healthcareprofessional';
    exercise.approvedAt = new Date();
    
    if (status === 'rejected') {
      exercise.rejectionReason = rejectionReason;
    }

    await exercise.save();
    console.log('Exercise status updated successfully');

    res.status(200).json({ 
      message: `Exercise ${status}`, 
      exercise: await Exercise.findById(exercise._id)
        .populate('createdBy', 'nom prenom')
        .populate('approvedBy', 'nom prenom')
    });
  } catch (err) {
    console.error('❌ Error updating exercise status:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteExercise = async (req, res) => {
  try {
    console.log('Deleting exercise:', req.params.id);
    console.log('User data:', req.user);

    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      console.log('Exercise not found:', req.params.id);
      return res.status(404).json({ message: 'Exercise not found' });
    }

    if (exercise.createdBy.toString() !== req.user.userId) {
      console.log('Unauthorized deletion attempt');
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Exercise.deleteOne({ _id: req.params.id });
    console.log('Exercise deleted successfully');
    
    res.status(200).json({ message: 'Exercise deleted' });
  } catch (err) {
    console.error('❌ Error deleting exercise:', err);
    console.error('Error details:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createExercise,
  getExercises,
  updateExerciseStatus,
  deleteExercise
};
  
  
