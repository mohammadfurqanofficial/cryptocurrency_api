const express = require('express');
const { saveCoinHistory, getCoinHistory, getAllCoinHistory, getCoinHistoryDownload, saveHistoryCron } = require('../controllers/coinHistoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// POST route to save coin history to the database
router.post('/save-history', saveCoinHistory);

// Route to get coin history by coin ID
router.get('/coin-history/:coinId', protect, getCoinHistory);

// Route to get coin history download by coin ID
router.get('/coin-history/download/:coinId', protect, getCoinHistoryDownload);

// Route to get coin history by coin ID
router.get('/all-coins-history', protect, getAllCoinHistory);

// Create a GET route specifically for the cron job
router.get('/save-history-cron', saveHistoryCron);


module.exports = router;
