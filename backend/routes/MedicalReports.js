const express = require('express');
const router = express.Router();
const controllers = require('../controllers/medicalReportsController');
console.log('✅ Imported controllers:', controllers);

const {
  getAllChildren,
  getChildMedicalRecord,
  addMedicalReport,
  getAllReports,
} = controllers;

const { authMiddleware, authorize } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/medicalReports/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Utilise les fonctions du contrôleur
// Get all children from all parents (for healthcare professionals)
router.get('/dossiers', authMiddleware, authorize(['healthcareprofessional']), async (req, res) => {
  try {
    const Parent = require('../models/user');
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

    res.status(200).json(allChildren);
  } catch (error) {
    console.error('Error fetching all children:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// New route for parents to get their own children
router.get('/children', authMiddleware, authorize(['parent', 'healthcareprofessional']), getAllChildren);

router.get('/dossier/:parentId/:childIndex/:extraParam?', authMiddleware, authorize(['parent', 'healthcareprofessional']), getChildMedicalRecord);
router.put('/dossier/:parentId/:childIndex', authMiddleware, authorize(['parent', 'healthcareprofessional']), controllers.updateChildMedicalRecord);
router.post('/report/:parentId/:childIndex', authMiddleware, authorize(['healthcareprofessional']), upload.single('attachment'), addMedicalReport);
router.get('/reports/:parentId/:childIndex', authMiddleware, authorize(['parent', 'healthcareprofessional']), getAllReports);


module.exports = router;
