const express = require('express');
const router = express.Router();

// Define your cron route
router.get('/save-coin-history', (req, res) => {
  console.log("This is cron API");
  res.status(200).json({ success: true });
});

module.exports = router;
