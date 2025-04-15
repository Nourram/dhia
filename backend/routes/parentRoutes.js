const express = require('express');
const router = express.Router();

const { signupParent, getParentProfile, editParentProfile } = require('../controllers/parentController');
const verifyToken = require('../middleware/authMiddleware');
const Parent = require('../models/user'); // <-- Make sure this is your parent model

// ✅ Parent registration
router.post('/signup', signupParent);

// ✅ NEW: Get parent by ID (including children)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const parent = await Parent.findById(req.params.id).select('children');
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.json({ children: parent.children });
  } catch (error) {
    console.error('Error fetching parent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
