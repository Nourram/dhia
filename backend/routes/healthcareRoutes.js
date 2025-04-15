const express = require('express');
const router = express.Router();
const { registerHealthCare } = require('../controllers/HealthCareController');
const HealthcareProfessional = require('../models/HealthcareProfessional');

// Route d'inscription
router.post('/signup', registerHealthCare);

// Route pour récupérer un professionnel de santé par ID
router.get('/:id', async (req, res) => {
  try {
    const user = await HealthcareProfessional.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
