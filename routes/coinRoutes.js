const express = require('express');
const { saveCoinHistory, getCoinHistory, getAllCoinHistory } = require('../controllers/coinController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST route to save coin history to the database
router.post('/save-history', protect, saveCoinHistory);

// Route to get coin history by coin ID
router.get('/coin-history/:coinId', getCoinHistory);

// Route to get coin history by coin ID
router.get('/all-coins-history', getAllCoinHistory);

module.exports = router;
