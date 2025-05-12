// controllers/medicalReportsController.js

const MedicalReport = require('../models/MedicalReport');
const Parent = require('../models/user');

// ✅ Get all children for the authenticated parent
const getAllChildren = async (req, res) => {
  try {
    if (req.user.userType === 'parent') {
      // Si c'est un parent → retourner uniquement ses enfants
      const parent = await Parent.findById(req.user.userId);
      if (!parent) return res.status(404).json({ message: 'Parent not found' });

      const children = parent.children.map((child, index) => ({
        parentId: parent._id,
        childIndex: index,
        fullName: `${child.childName} ${child.childLastName}`,
      }));

      return res.json(children);
    } else if (req.user.userType === 'healthcareprofessional') {
      // Si c'est un healthcareprofessional → retourner TOUS les enfants
      const parents = await Parent.find({}, 'children');
      const allChildren = [];

      parents.forEach(parent => {
        parent.children.forEach((child, index) => {
          allChildren.push({
            parentId: parent._id,
            childIndex: index,
            fullName: `${child.childName} ${child.childLastName}`,
          });
        });
      });

      return res.json(allChildren);
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  } catch (err) {
    console.error('Error fetching children:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// ✅ Get medical record for a specific child
const getChildMedicalRecord = async (req, res) => {
  const { parentId, childIndex, extraParam } = req.params;

  try {
    console.log('Debug: req.user.userId:', req.user.userId);
    console.log('Debug: req.user.userType:', req.user.userType);
    console.log('Debug: parentId:', parentId);
    console.log('Debug: extraParam:', extraParam);

    // Allow access if user is healthcare professional
    if (req.user.userType !== 'healthcareprofessional' && req.user.userId.toString() !== parentId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const child = parent.children[childIndex];
    if (!child) return res.status(404).json({ message: 'Child not found' });

    res.json({
      childInfo: {
        name: child.childName,
        lastName: child.childLastName,
        birthDate: child.childDateOfBirth,
        gender: child.childGender,
        level: child.childLevel,
        behavior: child.behavior,
        behaviorDescription: child.behaviorDescription,
        childSchool: child.childSchool,
        medications: child.medications,

      },
      medicalRecord: child.medicalRecord || null,
    });
  } catch (err) {
    console.error('Error fetching medical record:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addMedicalReport = async (req, res) => {
  const { parentId, childIndex } = req.params;
  const { title, description } = req.body;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const child = parent.children[childIndex];
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const content = `Title: ${title}\nDescription: ${description}`;

    const newReport = new MedicalReport({
      parentId,
      childIndex,
      professionalId: req.user.userId,
      content,
    });

    await newReport.save();
    res.status(201).json({ message: 'Report added successfully' });
  } catch (err) {
    console.error('Error adding medical report:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Get all reports for a child
const getAllReports = async (req, res) => {
  const { parentId, childIndex } = req.params;

  try {
    // ✅ Autoriser parent ou healthcareprofessional
    if (req.user.userType !== 'healthcareprofessional' && req.user.userId.toString() !== parentId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reports = await MedicalReport.find({ parentId, childIndex })
      .populate('professionalId', 'nom prenom specialite');

    res.status(200).json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateChildMedicalRecord = async (req, res) => {
  const { parentId, childIndex } = req.params;
  const { level, behavior, behaviorDescription, childSchool, medications } = req.body;

  try {
    const parent = await Parent.findById(parentId);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const child = parent.children[childIndex];
    if (!child) return res.status(404).json({ message: 'Child not found' });

    // Update child fields
    if (level !== undefined) child.childLevel = level;
    if (behavior !== undefined) child.behavior = behavior;
    if (behaviorDescription !== undefined) child.behaviorDescription = behaviorDescription;
    if (childSchool !== undefined) child.childSchool = childSchool;
    if (medications !== undefined) child.medications = medications;

    await parent.save();

    res.status(200).json({ message: 'Child info updated successfully' });
  } catch (err) {
    console.error('Error updating child info:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createMedicalRecord = async (req, res) => {
  const { parentId, childIndex } = req.params;

  try {
    const parent = await require('../models/user').findById(parentId);
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const child = parent.children[childIndex];
    if (!child) return res.status(404).json({ message: 'Child not found' });

    if (!child.medicalRecord) {
      child.medicalRecord = {
        allergies: '',
        medicalConditions: '',
        otherDetails: '',
      };
      await parent.save();
      return res.status(201).json({ message: 'Medical record created successfully' });
    } else {
      return res.status(400).json({ message: 'Medical record already exists' });
    }
  } catch (err) {
    console.error('Error creating medical record:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const mongoose = require('mongoose');

const deleteMedicalReport = async (req, res) => {
  const { reportId } = req.params;

  try {
    console.log('Attempting to delete medical report with ID:', reportId);

    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const report = await MedicalReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Medical report not found' });
    }

    await MedicalReport.deleteOne({ _id: reportId });
    res.status(200).json({ message: 'Medical report deleted successfully' });
  } catch (err) {
    console.error('Error deleting medical report:', err.message);
    console.error(err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getAllChildren,
  getChildMedicalRecord,
  addMedicalReport,
  getAllReports,
  updateChildMedicalRecord,
  createMedicalRecord,
  deleteMedicalReport,
};
