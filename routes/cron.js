const express = require('express');
const router = express.Router();
const { saveCoinHistory } = require('../controllers/coinHistoryController');

// Route for handling cron job to save coin history
router.get('/cron', async (req, res) => {
  // Authorization check
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Trigger the saveCoinHistory function to save coin data
    await saveCoinHistory(req, res);
    console.log('Cron job triggered and coin history saved successfully');
    res.status(200).json({ message: 'Coin history saved successfully' });
  } catch (error) {
    console.error('Error saving coin history:', error);
    res.status(500).json({ message: 'Failed to save coin history' });
  }
});

module.exports = router;
