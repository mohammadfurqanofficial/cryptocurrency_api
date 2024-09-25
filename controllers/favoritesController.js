const FavoriteCoin = require('../models/FavoriteCoin'); // Import the FavoriteCoin model
const CoinHistory = require('../models/CoinHistory'); // Import the CoinHistory model

// Function to get all favorite coins for the user along with their history
exports.getFavorites = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
      // Find all favorite coins for the user and populate the CoinHistory
      const favorites = await FavoriteCoin.find({ userId })
          .populate('coinHistoryId'); // Ensure 'coinHistoryId' is correctly set in schema

      if (!favorites.length) { // Check if there are no favorites
          return res.status(404).json({ message: "No favorite coins found for this user" });
      }

      // Respond with the user's favorite coins including their history
      res.status(200).json({
          message: "Favorite coins retrieved successfully",
          favorites,
      });
  } catch (error) {
      console.error("Error retrieving favorites:", error); // Log the error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to add a coin to favorites
exports.addToFavorites = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const { coinId, name, symbol, rank } = req.body; // Extract all required fields from the request body

  try {
    // Check if the favorite coin already exists for the user
    const existingFavorite = await FavoriteCoin.findOne({ userId, coinId });

    if (existingFavorite) {
      return res.status(400).json({ message: "Coin already in favorites" });
    }

    // Create a new favorite coin document
    const favoriteCoin = new FavoriteCoin({
      userId,
      coinId,
      name,
      symbol,
      rank,
    });

    // Save the favorite coin
    await favoriteCoin.save();

    // Respond with the newly added favorite coin
    res.status(201).json({
      message: "Coin added to favorites",
      favoriteCoin,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to remove a coin from favorites
exports.removeFromFavorites = async (req, res) => {
    const userId = req.user.id; // Get the user ID from the authenticated user
    const { coinId } = req.body; // Extract the coinId from the request body
  
    try {
      // Find and remove the favorite coin from the database
      const result = await FavoriteCoin.findOneAndDelete({ userId, coinId });
  
      if (!result) {
        return res.status(404).json({ message: "Coin not found in favorites" });
      }
  
      // Respond with a success message
      res.status(200).json({
        message: "Coin removed from favorites",
      });
    } catch (error) {
      console.error("Error removing from favorites:", error); // Log the error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
    }
};