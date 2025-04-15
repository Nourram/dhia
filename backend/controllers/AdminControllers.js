const Admin = require('../models/admin');  // Import du modèle Admin
const User = require('../models/user');    // Import du modèle User
const bcrypt = require('bcryptjs');        // Pour le hachage des mots de passe
const jwt = require('jsonwebtoken');      // Pour la génération de token JWT

// Fonction de connexion pour Admin ou User
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Chercher d'abord dans le modèle "Admin"
    let user = await Admin.findOne({ email });

    // Si aucun admin trouvé, chercher dans le modèle "User"
    if (!user) {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'Admin or User not found' });  // Aucun admin ni utilisateur trouvé
      }
    }

    // Comparaison des mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });  // Si les mots de passe ne correspondent pas
    }

    // Créer le token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, userType: user.userType },
      process.env.JWT_SECRET,  // ✅ utilise la même clé que dans le middleware
      { expiresIn: '1h' }
    );
    

    // Renvoi du token JWT dans la réponse
    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });  // En cas d'erreur serveur
  }
};