const User = require('../models/user'); // Parent model
const bcrypt = require('bcrypt');
const MedicalReport = require('../models/MedicalReport');

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
  } = req.body;

  console.log('📥 signupParent payload:', req.body);

  try {
    // 🔐 Check for existing email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'This email is already in use' });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
      children: child || [] // Must be array of objects
    });

    await newUser.save();

    res.status(201).json({
      message: '✅ Parent registered successfully',
      userId: newUser._id
    });

  } catch (error) {
    console.error('❌ Error registering parent:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
};

// ✅ Get children of a parent
const getChildren = async (req, res) => {
  try {
    const parent = await User.findById(req.user.id).select('children');
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.status(200).json(parent.children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Add a child to parent's children array
const addChild = async (req, res) => {
  const childData = req.body;
  try {
    const parent = await User.findById(req.user.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    parent.children.push(childData);
    await parent.save();
    res.status(201).json({ message: 'Child added successfully', child: childData });
  } catch (error) {
    console.error('Error adding child:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Update a child info by index
const updateChild = async (req, res) => {
  const { childIndex } = req.params;
  const updatedData = req.body;
  try {
    const parent = await User.findById(req.user.id);
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    if (childIndex < 0 || childIndex >= parent.children.length) {
      return res.status(404).json({ message: 'Child not found' });
    }
    parent.children[childIndex] = { ...parent.children[childIndex]._doc, ...updatedData };
    await parent.save();
    res.status(200).json({ message: 'Child updated successfully', child: parent.children[childIndex] });
  } catch (error) {
    console.error('Error updating child:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get medical reports for a parent's child
const getChildReports = async (req, res) => {
  const { childIndex } = req.params;
  try {
    const parentId = req.user.id;
    const reports = await MedicalReport.find({ parentId, childIndex }).populate('professionalId', 'nom prenom specialite');
    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching child reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  signupParent,
  getChildren,
  addChild,
  updateChild,
  getChildReports
};
