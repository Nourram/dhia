const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/admin"); // Correct chemin vers le modèle
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("Error connecting to MongoDB:", err));

async function updateAdminPassword() {
  const adminEmail = "admin@example.com"; // Remplace avec l'email de l'admin à mettre à jour
  const newPassword = "newpassword123";  // Le nouveau mot de passe que tu souhaites définir

  try {
    // Trouver l'admin par email
    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      console.log("Admin not found");
      return;
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe
    admin.password = hashedPassword;
    await admin.save();

    console.log("Password updated successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error updating password:", error);
  }
}

updateAdminPassword();
