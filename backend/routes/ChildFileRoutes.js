const express = require('express');
const router = express.Router();
const ChildFile = require('../models/childFileModel');
const verifyToken = require('../middleware/authMiddleware');

// CREATE or UPDATE file by parent
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'parent') {
      return res.status(403).json({ message: 'Only parents can create or update child files.' });
    }

    const { childName, note, externalFollowUp, interventionHistory } = req.body;

    let existingFile = await ChildFile.findOne({ parentId: req.user.userId, childName });

    if (existingFile) {
      existingFile.note = note;
      existingFile.externalFollowUp = externalFollowUp;
      existingFile.interventionHistory = interventionHistory;
      existingFile.lastUpdated = new Date();
      await existingFile.save();
      return res.status(200).json({ message: 'File updated', file: existingFile });
    }

    const newFile = new ChildFile({
      parentId: req.user.userId,
      childName,
      note,
      externalFollowUp,
      interventionHistory
    });

    await newFile.save();
    res.status(201).json({ message: 'File created', file: newFile });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all parent files (healthcare only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'healthcare' && req.user.userType !== 'healthcareprofessional') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const files = await ChildFile.find().populate('parentId', 'name email');
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET file by healthcare
router.get('/:parentId', verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== 'healthcare' && req.user.userType !== 'healthcareprofessional') {
      return res.status(403).json({ message: 'Only healthcare professionals can view child files.' });
    }

    const file = await ChildFile.findOne({ parentId: req.params.parentId });
    if (!file) return res.status(404).json({ message: 'File not found' });

    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
