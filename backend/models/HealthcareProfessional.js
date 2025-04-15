const mongoose = require('mongoose');

const healthcareProfessionalSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: 'healthcareprofessional'
  }
}, { timestamps: true });

module.exports = mongoose.model('HealthcareProfessional', healthcareProfessionalSchema);
