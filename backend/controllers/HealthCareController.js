const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Register a healthcare professional
const registerHealthCare = async (req, res) => {
  try {
    const {
      nom,
      prenom,
      email,
      password,
      confirmPassword,
      adresse,
      numeroTel,
      specialite
    } = req.body;

    // Validate required fields
    if (!nom || !prenom || !email || !password || !confirmPassword || !adresse || !numeroTel || !specialite) {
      return res.status(400).json({ 
        success: false,
        message: 'Tous les champs sont obligatoires.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: 'Format d\'email invalide.' 
      });
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères.' 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Les mots de passe ne correspondent pas.' 
      });
    }

    // Validate specialite
    const validSpecialites = ['Child Psychiatrist', 'Speech Therapist'];
    if (!validSpecialites.includes(specialite)) {
      return res.status(400).json({ 
        success: false,
        message: 'Spécialité invalide. Les spécialités valides sont: Child Psychiatrist, Speech Therapist.' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Cet email est déjà utilisé.' 
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user with healthcare professional role
    const newUser = new User({
      nom,
      prenom,
      email,
      password: hashedPassword,
      adresse,
      numeroTel,
      userType: 'healthcareprofessiona',
      specialite,
      isActive: true
    });

    await newUser.save();

    return res.status(201).json({ 
      success: true,
      message: 'Professionnel de santé inscrit avec succès.',
      data: {
        id: newUser._id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        userType: newUser.userType,
        specialite: newUser.specialite
      }
    });

  } catch (error) {
    console.error('Error in registerHealthCare:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Erreur lors de l\'inscription du professionnel de santé.',
      error: error.message 
    });
  }
};

module.exports = {
  registerHealthCare
}; 