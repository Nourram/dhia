const express = require('express');
const router = require('express').Router();
const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const User = require('../models/user');

// Send a message
router.post('/', async (req, res, next) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const newMessage = await Message.create({ senderId, receiverId, message });
    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
});

// Get distinct users who have messaged the admin
router.get('/admin/:adminId/users', async (req, res, next) => {
  try {
    const { adminId } = req.params;
    // Find distinct userIds who have messaged the admin or received messages from admin
    const userIds = await Message.distinct('senderId', { receiverId: adminId });
    const otherUserIds = await Message.distinct('receiverId', { senderId: adminId });
    const allUserIds = Array.from(new Set([...userIds, ...otherUserIds]));

    // Fetch user info for these IDs
    const users = await User.find({ _id: { $in: allUserIds } }, '_id userType');

    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Get all users in the system
router.get('/users/all', async (req, res, next) => {
  try {
    const users = await User.find({}, '_id userType');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});

router.get('/admin/:adminId/messages', async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: adminId },
        { receiverId: adminId }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

// Get messages for a specific user-admin conversation
router.get('/:userId/:adminId', async (req, res, next) => {
  try {
    const { userId, adminId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: adminId },
        { senderId: adminId, receiverId: userId }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.delete('/conversation/:userId/:adminId', async (req, res, next) => {
  try {
    const { userId, adminId } = req.params;
    await Message.deleteMany({
      $or: [
        { senderId: userId, receiverId: adminId },
        { senderId: adminId, receiverId: userId }
      ]
    });
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
