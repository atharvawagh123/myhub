const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRouter);

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

module.exports = app;