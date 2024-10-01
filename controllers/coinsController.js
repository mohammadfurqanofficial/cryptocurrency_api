const FavoriteCoin = require('../models/Coins'); // Import the FavoriteCoin model
// const CoinHistory = require('../models/CoinHistory'); // Import the CoinHistory model
const User = require('../models/User');

// Function to get all favorite coins along with their history
exports.getallFavorites = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  // console.log(userId);
  try {
    // Find the user by ID and populate the favoriteCoins array
    const user = await User.findById(userId).populate({
      path: 'favoriteCoins', // Populate favoriteCoins field
      populate: {
        path: 'coinHistoryId', // Populate the coinHistoryId field inside each favoriteCoin
      }
    });

    console.log("User data with favorite coin", user);
    
    if (!user || !user.favoriteCoins.length) {
      return res.status(404).json({ message: "No favorite coins found for this user" });
    }

    // Respond with the user's favorite coins including their history
    res.status(200).json({
      message: "Favorite coins retrieved successfully",
      favorites: user.favoriteCoins,
    });
  } catch (error) {
    console.error("Error retrieving favorites:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

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
    // Check if the coin already exists in the FavoriteCoin schema
    let favoriteCoin = await FavoriteCoin.findOne({ coinId });

    if (favoriteCoin) {
      // Coin already exists, now check if it's already added to user's favorites
      const existingInUser = await User.findOne({
        _id: userId,
        favoriteCoins: favoriteCoin._id
      });

      if (existingInUser) {
        return res.status(400).json({ message: "Coin already in your favorites" });
      }

      // Coin exists in the FavoriteCoin schema, but not in user's favorites, so add it
      await User.findByIdAndUpdate(
        userId,
        { $push: { favoriteCoins: favoriteCoin._id } }, // Add the existing favoriteCoin ID to user's favorites
        { new: true, useFindAndModify: false } // Ensure we get the updated user document
      );

      return res.status(200).json({
        message: "Coin added to your favorites",
        favoriteCoin,
      });
    }

    // Coin does not exist in FavoriteCoin schema, so create a new favorite coin document
    favoriteCoin = new FavoriteCoin({
      coinId,
      name,
      symbol,
      rank,
    });

    // Save the new favorite coin document
    await favoriteCoin.save();

    // After saving the new favorite coin, update the User model with the new favoriteCoin._id
    await User.findByIdAndUpdate(
      userId,
      { $push: { favoriteCoins: favoriteCoin._id } }, // Add the newly created favoriteCoin ID to user's favorites
      { new: true, useFindAndModify: false } // Ensure we get the updated user document
    );

    // Respond with the newly added favorite coin
    res.status(201).json({
      message: "New coin added to favorites",
      favoriteCoin,
    });
  } catch (error) {
    console.error("Error adding to favorites:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Function to remove a coin from favorites
exports.removeCoinFromFavorites = async (req, res) => {
  const userId = req.user.id; // Get the user ID from the authenticated user
  const { coinId } = req.body; // Extract the coinId from the request body

  try {
    // Find the coin object ID using the coin ID
    const favoriteCoin = await FavoriteCoin.findOne({ coinId });
    console.log("Remove coin provided",favoriteCoin);

    if (!favoriteCoin) {
      return res.status(404).json({ message: "Coin not found" });
    }

    const coinObjectId = favoriteCoin._id; // Get the objectId of the coin
    console.log("Coin Object ID", coinObjectId);
    
    // Find the user and remove the coinObjectId from favoriteCoins array
    const result = await User.findByIdAndUpdate(
      userId, // Find the user by their ID
      { $pull: { favoriteCoins: coinObjectId } }, // Remove the coin ObjectId from the favoriteCoins array
      { new: true } // Return the updated document
    );

    // Check if the user was found and updated
    if (!result) {
      return res.status(404).json({ message: "User not found or coin not in favorites" });
    }

    // Respond with a success message and updated user data
    res.status(200).json({
      message: "Coin removed from favorites",
      favoriteCoins: result.favoriteCoins // Send back the updated favoriteCoins array
    });
  } catch (error) {
    console.error("Error removing coin from favorites:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};