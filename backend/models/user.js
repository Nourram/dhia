const mongoose = require('mongoose')

// Schéma principal de l'utilisateur
const userSchema = new mongoose.Schema({
 

  // Informations générales
  nom: { type: String, required: true },              // Prénom du parent
  prenom: { type: String, required: true },           // Nom du parent
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adresse: { type: String, required: true },
  numeroTel: { type: String, required: true },

  userType: {
    type: String,
    enum: ['parent', 'Pedagogue', 'healthcareprofessional'],
    default: 'parent'
  },

  isActive: { type: Boolean, default: true },

  // Champs spécifiques aux parents
  relationAvecEnfant: {
    type: String,
    enum: ['Mother', 'Father'],
    required: function () {
      return this.userType === 'parent'
    }
  },

  children: {
    type: [
      {
        childName: { type: String, required: true },
        childLastName: { type: String, required: true },
        childDateOfBirth: { type: Date, required: true },
        childGender: { type: String, enum: ['Male', 'Female'], required: true },
        childLevel: { type: String, required: true },
        behavior: { type: String, required: true },
        behaviorDescription: { type: String },
        childSchool: { type: String },
        medications: { type: String },

        // ✅ Nouveau champ pour les exercices favoris
      favorites: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Exercise'
        }
      ]
      }
    ],
    required: function () {
      return this.userType === 'parent'
    }
  },

  // Champs spécifiques aux pédagogues
  nombreAnneeExperience: {
    type: Number,
    min: [0, 'Please enter a positive number of years of experience.'],
    required: function () {
      return this.userType === 'Pedagogue'
    }
  },
  diplomeObtenu: {
    type: String,
    required: function () {
      return this.userType === 'Pedagogue'
    }
  },

  // Champs spécifiques aux professionnels de santé
  specialite: {
    type: String,
    enum: ['Child Psychiatrist', 'Speech Therapist'],
    required: function () {
      return this.userType === 'healthcareprofessional'
    }
  }
}, { timestamps: true })



module.exports = mongoose.models.User || mongoose.model('User', userSchema)
