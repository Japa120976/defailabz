const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const registrationRoutes = require('./routes/registration');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Registration routes
app.use('/api/registration', registrationRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});