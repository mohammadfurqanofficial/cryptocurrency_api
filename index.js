const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const cryptoRoutes = require("./routes/cryptoRoutes");
const favoritesRoutes = require('./routes/favoritesRoutes');
const coinRoutes = require('./routes/coinRoutes'); // Make sure the path is correct
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use("/api", cryptoRoutes);
app.use("/api/favorites", favoritesRoutes);
// app.use('/api/coins', coinRoutes); // Correctly added

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
