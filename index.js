const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cryptoRoutes = require("./routes/cryptoRoutes");
const favoritesRoutes = require('./routes/favoritesRoutes');
const coinRoutes = require('./routes/coinRoutes');
import { cron } from './routes/cron.js';
const cors = require('cors');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api", cryptoRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/coins", coinRoutes);
app.use('/api/cron', cron);

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
