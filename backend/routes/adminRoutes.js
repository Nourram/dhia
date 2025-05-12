// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import Admin from '../models'; // Modèle Admin
// import { authMiddleware, authorizeRole } from '../middleware/authMiddleware.js';
// import { submitFeedback, getAllFeedback } from '../controllers/FeedbackController.js';

// const router = express.Router();

// // Login Route
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Find admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     // Generate JWT token with userType (added here)
//     const token = jwt.sign(
//       { id: admin._id, email: admin.email, userType: admin.userType }, // Ensure userType is included
//       process.env.JWT_SECRET, 
//       { expiresIn: "1h" }
//     );

//     res.json({ token });
//   } catch (error) {
//     console.error("Error during login:", error); 
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // New route to get admin ID
// router.get('/admin-id', async (req, res) => {
//   try {
//     console.log('GET /admin-id route hit');
//     // Assuming you want to return the first admin's id or a specific admin's id
//     const admin = await Admin.findOne();
//     if (!admin) {
//       return res.status(404).json({ message: 'Admin not found' });
//     }
//     res.json({ adminId: admin._id });
//   } catch (error) {
//     console.error('Error fetching admin ID:', error);
//     console.error(error.stack);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// export default router;
