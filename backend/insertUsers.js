const mongoose = require('mongoose');
const User = require('./models/user'); // Assure-toi que le chemin est correct

mongoose.connect('mongodb+srv://nourammarr9:autilearn@cluster0.tm2e2ry.mongodb.net/AutiLearnDB?retryWrites=true&w=majority&appName=Cluster0', {

  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedUsers = async () => {
  try {
    await User.deleteMany(); // Optionnel : pour nettoyer la base avant insertion

    const users = [
      {	
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        password: "password123",
        adresse: "123 rue des Lilas",
        numeroTel: 123456789,
        userType: "parent",
        relationAvecEnfant: "père",
        nomPrenomEnf: "Lucas Dupont",
        dateNaissanceEnf: new Date("2015-06-01"),
        niveau: 2,
        comportement: "Calme",
        nomEcole: "École Arc-en-ciel",
        medicaments: "aucun"
      },
      {
        nom: "Martin",
        prenom: "Claire",
        email: "claire.martin@example.com",
        password: "azerty123",
        adresse: "456 avenue de la Paix",
        numeroTel: 987654321,
        userType: "educator",
        nombreAnneeExperience: 5
      },
      {
        nom: "Lemoine",
        prenom: "Sophie",
        email: "sophie.lemoine@example.com",
        password: "orthopass",
        adresse: "789 boulevard Voltaire",
        numeroTel: 1122334455,
        userType: "healthcareprofessional",
        specialite: "orthophoniste"
      }
    ];

    await User.insertMany(users);
    console.log("✅ Utilisateurs insérés avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur lors de l'insertion :", error);
    process.exit(1);
  }
};

seedUsers();
