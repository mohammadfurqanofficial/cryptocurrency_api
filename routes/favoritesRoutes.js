const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Assuming you have an auth middleware
const { addToFavorites } = require("../controllers/favoritesController");
const router = express.Router();

// Protect route ensures the user is authenticated
router.post("/add", protect, addToFavorites);

module.exports = router;
