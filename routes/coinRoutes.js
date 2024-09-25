const express = require('express');
const protect = require('../middleware/authMiddleware'); // Ensure user is authenticated
const { getCoinUpdates } = require('../controllers/coinController');

const router = express.Router();


router.post('/updates', protect, getCoinUpdates); // Protected route to get coin updates

module.exports = router;
