const User = require('../models/user') // Parent model
const bcrypt = require('bcrypt')

// ✅ Register new parent user
const signupParent = async (req, res) => {
  const {
    name,
    lastName,
    email,
    password,
    address,
    phoneNumber,
    relationWithChild,
    child
  } = req.body

  console.log('📥 signupParent payload:', req.body)

  try {
    // 🔐 Check for existing email
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'This email is already in use' })
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 👨‍👩‍👧 Create user (type: parent)
    const newUser = new User({
      nom: name,
      prenom: lastName,
      email,
      password: hashedPassword,
      adresse: address,
      numeroTel: phoneNumber,
      userType: 'parent',
      relationAvecEnfant: relationWithChild,
      children: child // Must be array of objects
    })

    await newUser.save()

    res.status(201).json({
      message: '✅ Parent registered successfully',
      userId: newUser._id
    })

  } catch (error) {
    console.error('❌ Error registering parent:', error)
    res.status(500).json({ message: 'Server error, please try again' })
  }
}

module.exports = 
{ signupParent,
}
