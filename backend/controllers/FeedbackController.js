const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const { userName, userEmail, message } = req.body;
    if (!message || !userName || !userEmail) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const feedback = new Feedback({ userName, userEmail, message });
    await feedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
