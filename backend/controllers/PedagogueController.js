// controllers/pedagogueController.js

const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Register a pedagogue (pedagogue)
const registerPedagogue = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      password,
      confirmPassword,
      adresse,
      numeroTel,
      nombreAnneeExperience,
      diplomeObtenu
    } = req.body;

    // Validate required fields
    if (!nom || !prenom || !email || !password || !confirmPassword || !adresse || !numeroTel || !nombreAnneeExperience || !diplomeObtenu) {
      return res.status(400).json({ 
        success: false,
        message: 'Tous les All fields are required.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid email forma.' 
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long.' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Oops! Passwords do not match.' 
      });
    }

    // Validate nombreAnneeExperience
    const experience = Number(nombreAnneeExperience);
    if (isNaN(experience) || experience < 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter a positive number of years of experience.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'This email is already in use.' 
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user with pedagogue role
    const newUser = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      adresse,
      numeroTel,
      userType: 'Pedagogue',
      nombreAnneeExperience: experience,
      diplomeObtenu,
      isActive: true
    });

    await newUser.save();

    return res.status(201).json({ 
      success: true,
      message: 'pedagogue registered successfully.',
      data: {
        id: newUser._id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        userType: newUser.userType
      }
    });

  } catch (error) {
    console.error('Oops! Something went wrong while registering the pedagogue:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Oops! Server error. Try again later, please.' 
    });
  }
};

module.exports = {
  registerPedagogue
};
