const express = require('express');
const { saveCoinHistory, getCoinHistory, getAllCoinHistory, getCoinHistoryDownload } = require('../controllers/coinHistoryController');
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

// Cron API
// Create a GET route specifically for the cron job
router.get('/save-history-cron', async (req, res) => {
    try {
      // Internally call the POST route to trigger the saveCoinHistory function
      const response = await axios.post(`${process.env.API_URL}/api/coins/save-history`);
      console.log(response);
      res.status(200).json({ message: "Cron job triggered successfully", data: response.data });
    } catch (error) {
      console.error("Error triggering cron job:", error.message);
      res.status(500).json({ message: "Error triggering cron job", error: error.message });
    }
  });


module.exports = router;
