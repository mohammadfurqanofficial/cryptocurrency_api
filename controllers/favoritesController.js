const User = require("../models/User");

exports.getFavorites = async (req, res) => {
    const userId = req.user.id; // Get the user ID from the authenticated user
  
    try {
      // Find the user by ID and populate the favorites
      const user = await User.findById(userId); // No need to populate since you're storing the complete favorite schema
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Respond with the user's favorites
      res.status(200).json({
        favorites: user.favorites, // Return the favorites directly
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

exports.addToFavorites = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const { coinId, name, symbol, rank } = req.body; // Extract coinId, name, symbol, and rank from the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the coin is already in the user's favorites
    const coinExists = user.favorites.find(favorite => favorite.coinId === coinId);
    if (coinExists) {
      return res.status(400).json({ message: "Coin already in favorites" });
    }

    // Add the coin to the user's favorites with additional details
    user.favorites.push({ coinId, name, symbol, rank });
    await user.save();

    // Respond with the updated favorites list
    res.status(200).json({
      message: "Coin added to favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Function to remove a coin from favorites
exports.removeFromFavorites = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const { coinId, name, symbol, rank } = req.body; // Extract the coinId from the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the coin is in the user's favorites
    if (!user.favorites.includes(coinId)) {
      return res.status(400).json({ message: "Coin not found in favorites" });
    }

    // Remove the coin from the user's favorites
    user.favorites = user.favorites.filter((id) => id !== coinId);
    await user.save();

    // Respond with the updated favorites list
    res.status(200).json({
      message: "Coin removed from favorites",
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
