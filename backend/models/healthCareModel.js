const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const healthcareProfessionalSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  adresse: {
    type: String,
    required: true
  },
  numeroTel: {
    type: String,
    required: true
  },
  specialite: {
    type: String,
    required: true,
    enum: ['Child Psychiatrist', 'Speech Therapist']
  },
  institution:{
    type: String,
    required: true,
  },
  Degree:{
    type: String,
    required: true,
  },
  userType: {
    type: String,
    default: 'healthcareProfessional',
    enum: ['healthcareProfessional']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash le mot de passe avant de sauvegarder
healthcareProfessionalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
healthcareProfessionalSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const HealthCare = mongoose.model('HealthCareProfessional', healthcareProfessionalSchema);

module.exports = HealthCare; 