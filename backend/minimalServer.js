const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Add exercisesRoutes
const exercisesRoutes = require('./routes/exercisesRoutes');
app.use('/api/exercises', exercisesRoutes);

app.get('/', (req, res) => {
  res.send('Minimal backend server with exercisesRoutes is running!');
});

app.listen(port, () => {
  console.log('Minimal server listening at http://localhost:' + port);
});
