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
const userId = req.user.id;
const { coinId, name, symbol, rank } = req.body; // Ensure these fields are provided

try {
    const user = await User.findById(userId);
    const coinExists = user.favorites.find(favorite => favorite.coinId === coinId);
    if (coinExists) {
    return res.status(400).json({ message: "Coin already in favorites" });
    }

    user.favorites.push({ coinId, name, symbol, rank });
    await user.save();

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
    const userId = req.user.id;
    const { coinId } = req.body; // Only need coinId for removal
  
    try {
      const user = await User.findById(userId);
  
      // Check if the coin is in the user's favorites
      const coinExists = user.favorites.find(favorite => favorite.coinId === coinId);
      if (!coinExists) {
        return res.status(400).json({ message: "Coin not found in favorites" });
      }
  
      // Remove the coin from the user's favorites
      user.favorites = user.favorites.filter(favorite => favorite.coinId !== coinId);
      await user.save();
  
      res.status(200).json({
        message: "Coin removed from favorites",
        favorites: user.favorites,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };  