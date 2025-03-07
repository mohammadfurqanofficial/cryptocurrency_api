const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cryptoRoutes = require("./routes/cryptoRoutes"); // Import the new crypto routes
const favoritesRoutes = require('./routes/favoritesRoutes'); // New favorite route
const coinRoutes = require('./routes/coinRoutes'); // New favorite route
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors()); // Enable CORS

// Routes
app.use('/api/auth', authRoutes);
app.use("/api", cryptoRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/coins", coinRoutes);


// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Listen to port from .env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
