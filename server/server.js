const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Ensure MongoDB database is connected before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/estimates', require('./routes/estimationRoutes'));
app.use('/api/consultations', require('./routes/consultationRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));

app.get('/api', (req, res) => {
  res.json({ message: 'BuildPrime API server is running' });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5500;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
