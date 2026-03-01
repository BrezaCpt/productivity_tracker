const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productivityRoutes = require('./routes/productivityRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/productivity', productivityRoutes);

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});