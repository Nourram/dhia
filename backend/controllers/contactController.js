const Message = require('../models/ChatBot');
const io = require('../server').io; // We will export io from server.js for socket access

// Create a new contact message and notify receiver via socket
exports.createContactMessage = async (req, res, next) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const newMessage = await Message.create({ senderId, receiverId, message });

    // Emit socket event to receiver
    if (io) {
      io.to(receiverId).emit('receive_message', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
};

// Get all contact messages between two users
exports.getContactMessages = async (req, res, next) => {
  try {
    const { userId1, userId2 } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    next(err);
  }
};
