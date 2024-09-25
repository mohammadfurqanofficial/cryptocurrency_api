const express = require('express');
const { protect } = require("../middleware/authMiddleware"); // Assuming you have an auth middleware
const { saveCoinHistory } = require('../controllers/coinController'); // Make sure you're correctly importing your controller

const router = express.Router();

// POST route to save coin history
router.post('/save', protect, saveCoinHistory);

module.exports = router;
