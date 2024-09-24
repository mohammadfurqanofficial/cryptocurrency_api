const express = require('express');
const { getCoinUpdates } = require('../controllers/coinController'); // Ensure the controller is correctly imported
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Use the correct callback for the get method
router.get('/updates', protect, getCoinUpdates);

module.exports = router; // Correctly export the router
