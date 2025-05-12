// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import http from 'http';
// import { Server } from 'socket.io';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import './models/HealthcareProfessional.js';
// import './models/Exercise.js';
// import './models/user.js';
// import './models/admin.js';
// import './models/ChatBot.js'; // Message model

// // import contactRoutes from './routes/contactRoutes.js';
// // import adminDashboardRoutes from './routes/adminDashboardRoutes.js';
// import healthcareDashboardRoutes from './routes/healthcareDashboardRoutes.js';
// import resetPasswordRoutes from './routes/resetPasswordRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// // import AdminProfileRoute from './routes/AdminProfileRoute.js';
// import userRoutes from './routes/userRoutes.js';
// import authRoutes from './routes/authRoutes.js';
// import parentRoutes from './routes/parentRoutes.js';
// import pedagogueuserRoutes from './routes/pedagogueuserRoutes.js';
// import healthcareRoutes from './routes/healthcareRoutes.js';
// import exerciseRoutes from './routes/exerciseRoutes.js';
// import participationRoutes from './routes/participationRoutes.js';
// import favoriteRoutes from './routes/favoriteRoutes.js';
// import MedicalReports from './routes/MedicalReports.js';
// // import mediaUploadRoutes from './routes/mediaUploadRoutes.js';
// // import feedbackRoutes from './routes/feedbackRoutes.js';
// // import messageRoutes from './routes/messageRoutes.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Import contact routes
// // app.use('/api/contact', contactRoutes);

// app.use('/api/admin-dashboard', adminDashboardRoutes);
// app.use('/api/healthcare-dashboard', healthcareDashboardRoutes);

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log("✅ MongoDB Connected"))
// .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// // Import and Mount Routes
// app.use('/api/reset', resetPasswordRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/admin/profile', AdminProfileRoute);
// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/parent', parentRoutes);
// app.use('/api/pedagogue', pedagogueuserRoutes);
// app.use('/api/healthcare', healthcareRoutes);
// app.use('/api/exercises', exerciseRoutes);
// app.use('/api/participation', participationRoutes);
// app.use('/api/favorites', favoriteRoutes);
// app.use('/api/medical-reports', MedicalReports);
// // app.use('/api/media', mediaUploadRoutes);
// app.use('/api', feedbackRoutes);
// app.use('/api/messages', messageRoutes);

// // Health check
// app.get('/', (req, res) => {
//   res.send('✅ Backend is running!');
// });

// // Create HTTP server
// const server = http.createServer(app);

// // Setup Socket.IO
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST']
//   }
// });

// // Export io for use in controllers
// export { io };

// io.on('connection', (socket) => {
//   console.log('🟢 New client connected:', socket.id);

//   // Join room (userId)
//   socket.on('join_room', (userId) => {
//     socket.join(userId);
//     console.log(`User ${userId} joined their room`);
//   });

//   // Handle send_message
//   socket.on('send_message', async ({ senderId, receiverId, message }) => {
//     try {
//       const newMessage = await Message.create({ senderId, receiverId, message });
//       // Emit to receiver
//       io.to(receiverId).emit('receive_message', newMessage);
//     } catch (err) {
//       console.error('Error saving message:', err);
//     }
//   });

//   // Disconnect
//   socket.on('disconnect', () => {
//     console.log('🔴 Client disconnected:', socket.id);
//   });
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// // Global Error Catcher
// process.on('uncaughtException', (err) => {
//   console.error('Uncaught Exception:', err);
// });

// // Catch-all 404 handler for unmatched routes
// app.use((req, res, next) => {
//   console.log(`❓ Unmatched route: ${req.method} ${req.originalUrl}`);
//   res.status(404).json({ message: 'Route not found' });
// });

// // Centralized Error Handler
// app.use((err, req, res, next) => {
//   console.error('Express Error Handler:', err);
//   const statusCode = err.statusCode || 500;
//   const message = err.message || 'Internal Server Error';
//   res.status(statusCode).json({ message });
// });



const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load environment variables
dotenv.config();

// Load Mongoose models
require('./models/HealthcareProfessional');
require('./models/Exercise');
require('./models/user');
require('./models/admin');
require('./models/ChatBot');

// Load routes
/*const healthcareDashboardRoutes = require('./routes/healthcareDashboardRoutes');*/
const resetPasswordRoutes = require('./routes/resetPasswordRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const parentRoutes = require('./routes/parentRoutes');
const pedagogueuserRoutes = require('./routes/pedagogueuserRoutes');
const healthcareRoutes = require('./routes/healthcareRoutes');
const exercisesRoutes = require('./routes/exercisesRoutes');
const participationRoutes = require('./routes/participationRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const MedicalReports = require('./routes/MedicalReports');
const feedbackRoutes = require('./routes/feedbackRoutes');
const messageRoutes = require('./routes/messageRoutes');
const AdminProfileRoute = require('./routes/AdminProfileRoute');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
/*app.use('/api/admin-dashboard', healthcareDashboardRoutes);*/
/*app.use('/api/healthcare-dashboard', healthcareDashboardRoutes);*/
app.use('/api/reset', resetPasswordRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/profile', AdminProfileRoute);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/pedagogue', pedagogueuserRoutes);
app.use('/api/healthcare', healthcareRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/participation', participationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/medical-reports', MedicalReports);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('send_message', async ({ senderId, receiverId, message }) => {
    try {
      const Message = mongoose.model('ChatBot'); // Use your model correctly
      const newMessage = await Message.create({ senderId, receiverId, message });
      io.to(receiverId).emit('receive_message', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// 404 handler
app.use((req, res) => {
  console.log(`❓ Unmatched route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({ message });
});
