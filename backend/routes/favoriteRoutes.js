const express = require('express');
const router = express.Router();
const User = require('../models/user');
const verifyToken = require('../middleware/authMiddleware');

// Toggle favorite
router.post('/:exerciseId', verifyToken, async (req, res) => {
  const { childIndex } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    const child = user.children[childIndex];

    if (!child) return res.status(404).json({ message: 'Child not found' });

    const isFav = child.favorites?.includes(req.params.exerciseId);

    if (isFav) {
      child.favorites.pull(req.params.exerciseId);
    } else {
      child.favorites.push(req.params.exerciseId);
    }

    await user.save();
    res.status(200).json({ message: isFav ? 'Removed' : 'Added' });
  } catch (err) {
    console.error('Favorite toggle error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all favorites of a child
router.get('/:childIndex', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('children.favorites');

    const child = user.children[req.params.childIndex];
    if (!child) return res.status(404).json({ message: 'Child not found' });

    res.status(200).json(child.favorites || []);
  } catch (err) {
    console.error('Get favorites error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
