// routes/messageRoutes.js
const express = require('express');
const router = express.Router();

// Exemple de route vide
router.get('/', (req, res) => {
  res.send('Message route OK');
});

module.exports = router;
