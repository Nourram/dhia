const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('./models/HealthcareProfessional'); // 👈 obligatoire pour que Mongoose le connaisse

// Load environment variables
dotenv.config();

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Import Routes
const adminRoutes = require('./routes/adminRoutes');
const adminProfileRoutes = require('./routes/AdminProfileRoute');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const parentRoutes = require('./routes/parentRoutes');
const pedagogueRoutes = require('./routes/pedagogueuserRoutes');
const healthcareRoutes = require('./routes/healthcareRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const participationRoutes = require('./routes/participationRoutes');
const childFileRoutes = require('./routes/ChildFileRoutes');
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');
app.use('/api/reset', resetPasswordRoutes);

// ✅ Mount Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/profile', adminProfileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth/parent', parentRoutes);
app.use('/api/pedagogues', pedagogueRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/exercises', exerciseRoutes);              // Exercises by pedagogue/healthcare/parent
app.use('/api/participation', participationRoutes);     // Child participation & scores
app.use('/api/favorites', require('./routes/favoriteRoutes'));
app.use('/api/child-files', childFileRoutes);

// 🌍 Health check route
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// 🛑 Global Error Catcher
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
