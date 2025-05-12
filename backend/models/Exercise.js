const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  // 🔤 Infos de base
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

  // ✅ Type de validation
  validationType: {
    type: String,
    enum: ['auto'],
    default: 'auto'
  },

  // 🧠 Logique de réponse
  expectedOutcome: {
    type: String,
    required: true
  },
  scoreLogic: {
    total: { type: Number, required: true },
    correctRequired: { type: Number, required: true }
  },

  // 📝 Statut de validation
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: null
  },

  // 👤 Créateur (toujours depuis User)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ Tous les users (pedagogue etc.) sont dans User
    required: true
  },

  // ✅ Validateur
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ✅ Idem ici
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },

  // 🎧 Médias
  media: {
    image: { type: String, default: '' },
    audio: { type: String, default: '' }
  },

  // ✅ Choix (pour cognitif/social)
  choices: [
    {
      text: { type: String, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],

  // 💬 Feedback
  feedback: {
    correct: { type: String, default: '' },
    incorrect: { type: String, default: '' }
  },

  // 🏃 Données spécifiques au type
  typeSpecificData: {
    gestureToDo: { type: String },
    duration: { type: Number } // en secondes
  }

}, {
  timestamps: true // ✅ createdAt & updatedAt automatiques
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;
