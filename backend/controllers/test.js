const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const Admin = require('../models/admin');
const Parent = require('../models/parentModel');
const Pedagogue = require('../models/pedagogueModel');
const HealthCare = require('../models/healthCareModel');
const ResetCode = require('../models/ResetCode'); // Assure-toi que ce fichier existe

// Transporteur Nodemailer (avec Gmail, à adapter selon ton provider)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔐 Register Admin
const registerAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) return res.status(400).json({ message: 'Admin already exists' });

    const admin = new Admin({ email, password, userType: 'admin' });
    await admin.save();

    const token = jwt.sign(
      { userId: admin._id, userType: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔑 Login Admin
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: admin._id, userType: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, userType: 'admin' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔐 Login User (parent, pedagogue, healthcare)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Parent.findOne({ email }) ||
               await Pedagogue.findOne({ email }) ||
               await HealthCare.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const userType = user instanceof Parent ? 'parent' :
                     user instanceof Pedagogue ? 'pedagogue' : 'healthcare';

    const token = jwt.sign({ userId: user._id, userType }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userType });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Send reset code
const sendResetCode = async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chiffres

  try {
    await ResetCode.findOneAndUpdate(
      { email },
      { code, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${code}`
    });

    res.status(200).json({ message: 'Code sent to email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to send reset code' });
  }
};

// ✅ Verify reset code
const verifyResetCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const record = await ResetCode.findOne({ email, code });
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    res.status(200).json({ message: 'Code verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying code' });
  }
};

const User = require('../models/user'); // ajoute ça en haut si ce n’est pas encore fait

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await Admin.findOne({ email }) || await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Password reset failed' });
  }
};

// ✅ JWT middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied: no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ✅ Export
module.exports = {
  registerAdmin,
  loginAdmin,
  loginUser,
  verifyToken,
  sendResetCode,
  verifyResetCode,
  resetPassword
};
