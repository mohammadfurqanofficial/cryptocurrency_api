const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Assuming you have an auth middleware
const { addToFavorites, removeFromFavorites, getFavorites } = require("../controllers/favoritesController");

const router = express.Router();

// Protect route ensures the user is authenticated
router.post("/add", protect, addToFavorites);

// Route to remove a favorite
router.delete('/remove', protect, removeFromFavorites);

// Route to get FavoriteCoins
router.get('/', protect, getFavorites);

module.exports = router;
