const mongoose = require('mongoose');

const childFileSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  childName: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  },
  externalFollowUp: {
    type: String,
    default: ''
  },
  interventionHistory: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ChildFile', childFileSchema);
