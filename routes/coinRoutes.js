const express = require('express');
const { getCoinUpdates, saveCoinHistory } = require('../controllers/coinController'); // Import functions from controller
const protect = require('../middleware/authMiddleware'); // Middleware to ensure user is authenticated

const router = express.Router();

// Define GET route to fetch coin updates for authenticated users
// router.get('/updates', protect, getCoinUpdates);

// Define POST route to save coin history to the database
router.post('/save-history', protect, saveCoinHistory);

module.exports = router;
