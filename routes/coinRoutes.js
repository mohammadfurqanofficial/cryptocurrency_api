const express = require('express');
const { saveCoinHistory } = require('../controllers/coinController'); // Make sure you're correctly importing your controller
const protect = require('../middleware/authMiddleware'); // Assuming this middleware is used for authentication

const router = express.Router();

// POST route to save coin history
router.post('/save', protect, saveCoinHistory);

module.exports = router;
