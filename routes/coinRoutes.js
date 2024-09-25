const express = require('express');
const { getCoinUpdates, saveCoinHistory } = require('../controllers/coinController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// GET route to fetch coin updates
router.get('/updates', protect, getCoinUpdates);

// POST route to save coin history to the database
router.post('/save-history', protect, saveCoinHistory);

module.exports = router;
