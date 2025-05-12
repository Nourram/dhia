const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST create a new contact message
router.post('/', contactController.createContactMessage);

// GET messages between two users
router.get('/:userId1/:userId2', contactController.getContactMessages);

module.exports = router;
