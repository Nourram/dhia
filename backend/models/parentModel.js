const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schéma d'un enfant
const childSchema = new mongoose.Schema({
  childName: { type: String, required: true },
  childLastName: { type: String, required: true },
  childDateOfBirth: { type: Date, required: true },
  childGender: { type: String, enum: ['Male', 'Female'], required: true },
  childLevel: { type: String, required: true },
  behavior: { type: String, required: true },
  behaviorDescription: { type: String },
  childSchool: { type: String },
  medications: { type: String }
});

// Schéma du parent
const parentSchema = new mongoose.Schema({
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
  userType: {
    type: String,
    default: 'parent',
    enum: ['parent']
  },
  relationAvecEnfant: {
    type: String,
    enum: ['Mother', 'Father'],
    required: true
  },
  children: {
    type: [childSchema],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash le mot de passe avant de sauvegarder
parentSchema.pre('save', async function(next) {
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
parentSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
