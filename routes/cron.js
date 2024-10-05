const express = require('express');
const { saveCoinHistory } = require('../controllers/coinHistoryController');
const router = express.Router();

router.get('/save-coin-history', async (req, res) => {
  try {
    // Call the saveCoinHistory function
    await saveCoinHistory();
    res.status(200).json({ message: 'Coin history saved successfully' });
  } catch (error) {
    console.error('Error saving coin history:', error);
    res.status(500).json({ error: 'Failed to save coin history' });
  }
});

module.exports = router;
