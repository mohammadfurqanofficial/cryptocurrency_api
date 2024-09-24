const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // Assuming you have an auth middleware
const { addToFavorites, removeFromFavorites } = require("../controllers/favoritesController");

const router = express.Router();

// Protect route ensures the user is authenticated
router.post("/add", protect, addToFavorites);

// Route to remove a favorite
router.delete('/remove', protect, removeFromFavorites); // Remove a coin from favorites


// Route to remove a favorite
// router.post('/remove', protect, removeFromFavorites); // Protect the route with authentication middleware


module.exports = router;
