const express = require('express');
const { getCoinUpdates } = require('../controllers/coinController');
const protect = require('../middleware/authMiddleware'); // Ensure user is authenticated

const router = express.Router();

router.get('/updates', protect, getCoinUpdates); // Protected route to get coin updates

module.exports = router;
