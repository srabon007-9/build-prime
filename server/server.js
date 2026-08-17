const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, mobile apps, or relative /api calls)
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) return callback(null, true)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true
}))
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/estimates', require('./routes/estimationRoutes'));
app.use('/api/consultations', require('./routes/consultationRoutes'));

// Root test route to easily check backend health on Vercel
app.get('/api', (req, res) => {
  res.json({ message: 'BuildPrime API is running smoothly on Vercel' });
});

// Only listen on a port during local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// REQUIRED FOR VERCEL: Export the Express app instance
module.exports = app;
