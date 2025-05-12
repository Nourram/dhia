// models/MedicalReport.js
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent', required: true },
  childIndex: { type: Number, required: true },
  professionalId: { type: mongoose.Schema.Types.ObjectId, ref: 'HealthCareProfessional', required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalReport', reportSchema);
