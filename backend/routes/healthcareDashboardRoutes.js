/*const express = require('express');
const router = express.Router();
const { getHealthcareDashboardKPIs } = require('../controllers/HealthcareDashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect and authorize only healthcare professionals
router.use(protect);
router.use(authorize('healthcareprofessional'));

router.get('/kpis', getHealthcareDashboardKPIs);

*/