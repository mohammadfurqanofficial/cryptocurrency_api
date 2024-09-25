const express = require('express');
const { getCoinUpdates } = require('../controllers/coinController'); // Correctly import the controller function
const protect = require('../middleware/authMiddleware'); // Ensure user is authenticated

const router = express.Router();

router.get('/updates', protect, getCoinUpdates); // Pass the function directly

module.exports = router; // Correctly export the router
