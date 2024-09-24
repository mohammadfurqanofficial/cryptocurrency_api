const User = require("../models/User");

// Function to add a coin to favorites
exports.addToFavorites = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const { coinId } = req.body; // Extract the coinId from the request body

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the coin is already in the user's favorites
    if (user.favorites.includes(coinId)) {
      return res.status(400).json({ message: "Coin already in favorites" });
    }

    // Add the coin to the user's favorites
    user.favorites.push(coinId);
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
  const { coinId } = req.body; // Extract the coinId from the request body

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
