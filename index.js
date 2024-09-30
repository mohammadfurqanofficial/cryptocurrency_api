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
app.use('/api/auth', authRoutes); // Authentication routes
app.use("/api", cryptoRoutes); // Add the cryptocurrency routes here
app.use("/api/favorites", favoritesRoutes); // Add this line
app.use("/api/coins", coinRoutes); // Add this line

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// setInterval(() => {
//   saveCoinHistory();
//   checkAndSendAlerts();

//   console.log("chamou");
// }, 60000);

// Listen to port from .env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));