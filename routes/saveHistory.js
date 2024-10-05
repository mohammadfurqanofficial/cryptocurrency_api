const express = require('express');
const router = express.Router();
const { saveCoinHistory } = require('../controllers/coinHistoryController');

// Define your cron route
router.get('/save-coin-history', (req, res) => {
  console.log(saveCoinHistory());
  console.log("This is cron API");
  res.status(200).json({ success: true });
});

module.exports = router;
