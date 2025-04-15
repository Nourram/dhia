const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  // BASIC INFO
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['cognitive', 'motor', 'social'],
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  // VALIDATION TYPE
  validationType: {
    type: String,
    enum: ['auto'], // future: 'manual', 'ai-assisted'
    default: 'auto'
  },

  // EXPECTED OUTCOME / LOGIC
  expectedOutcome: {
    type: String,
    required: true
  },
  scoreLogic: {
    total: { type: Number, required: true },
    correctRequired: { type: Number, required: true }
  },

  // REVIEW STATUS
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },

  rejectionReason: {
    type: String,
    default: null
  },

  // RELATIONS: CREATOR (pedagogue/admin)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'createdByModel',
    required: true
  },
  createdByModel: {
    type: String,
    enum: ['Pedagogue', 'Admin'],
    required: true
  },

  // RELATIONS: APPROVED BY (healthcare/admin)
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'approvedByModel',
    default: null
  },
  approvedByModel: {
    type: String,
    enum: ['healthcareprofessional', 'Admin'],
    default: 'healthcareprofessional'
  },
  approvedAt: {
    type: Date,
    default: null
  },

  // MEDIA (optional)
  media: {
    image: { type: String, default: '' },
    audio: { type: String, default: '' }
  },

  // CHOICES (for cognitive/social exercises)
  choices: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],

  // FEEDBACK
  feedback: {
    correct: { type: String, default: '' },
    incorrect: { type: String, default: '' }
  },

  // SPECIFIC DATA (e.g. for motor exercises)
  typeSpecificData: {
    gestureToDo: { type: String },
    duration: { type: Number } // in seconds
  },

  // TIMESTAMPS
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;
