const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const Parent = require('../models/parentModel');
const mongoose = require('mongoose');
require('dotenv').config();

const createAdmin = async () => {
    const hashedPassword = await bcrypt.hash('admin123456', 10);

    const newAdmin = new Admin({
        email: 'admin@example.com',
        password: hashedPassword,
    });

    await newAdmin.save();
    console.log("Admin created successfully!");
};

const createUsers = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Créer l'admin
        await createAdmin();

        // Créer l'utilisateur parent
        const hashedPassword2 = await bcrypt.hash('admin123456', 10);
        const parent = new Parent({
            email: 'admine@example.com',
            password: hashedPassword2,
            prenom: 'Admin',
            nom: 'User',
            numeroTel: '1234567890',
            adresse: '123 Test Street',
            userType: 'parent'
        });
        await parent.save();
        console.log("Parent user created successfully!");

        // Fermer la connexion
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createUsers().catch((err) => {
    console.error(err);
});
