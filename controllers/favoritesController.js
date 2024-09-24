// const User = require("../models/User");
// Function to add a coin to favorites
const FavoriteCoin = require('../models/FavoriteCoin'); // Import the FavoriteCoin model

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
// exports.removeFromFavorites = async (req, res) => {
//   const userId = req.user.id; // Get the user ID from the authenticated user
//   const { coinId, name, symbol, rank } = req.body; // Extract the coinId from the request body

//   try {
//     // Find the user by ID
//     const user = await User.findById(userId);

//     // Check if the coin is in the user's favorites
//     if (!user.favorites.includes(coinId)) {
//       return res.status(400).json({ message: "Coin not found in favorites" });
//     }

//     // Remove the coin from the user's favorites
//     user.favorites = user.favorites.filter((id) => id !== coinId);
//     await user.save();

//     // Respond with the updated favorites list
//     res.status(200).json({
//       message: "Coin removed from favorites",
//       favorites: user.favorites,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };