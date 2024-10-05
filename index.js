const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cronRoutes = require('./routes/cron'); // Add this line
const authRoutes = require('./routes/authRoutes');
const cryptoRoutes = require("./routes/cryptoRoutes");
const favoritesRoutes = require('./routes/favoritesRoutes');
const coinRoutes = require('./routes/coinRoutes');
const cors = require('cors');;

// const alertRoutes = require("./routes/alertRoutes");
// app.use("/api/alerts", alertRoutes); // Add the alerts route

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
app.use('/api/cron', cronRoutes); // Add this line

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// setInterval(() => {
//   saveCoinHistory(); // Call the saveCoinHistory function every minute
//   console.log("Called saveCoinHistory at:", new Date().toISOString());
// }, 60000); // 60000 ms = 1 minute

// Listen to port from .env or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
