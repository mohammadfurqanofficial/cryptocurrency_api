const axios = require('axios');
const FavoriteCoin = require('../models/FavoriteCoin');
const CoinHistory = require('../models/CoinHistory');

// Function to get all coin history
exports.getAllCoinHistory = async (req, res) => {
  try {
      // Retrieve all coin history entries
      const coinHistories = await CoinHistory.find();

      if (!coinHistories.length) {
          return res.status(404).json({ message: "No coin history found" });
      }

      // Respond with the retrieved coin history
      res.status(200).json({
          message: "Coin history retrieved successfully",
          coinHistories,
      });
  } catch (error) {
      console.error("Error retrieving coin history:", error); // Log the error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to get all coin history for a specific coin
exports.getCoinHistory = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { coinId } = req.params; // Get the coin ID from the request parameters

  try {
      const userId = req.user ? req.user.id : null;

      // Fetch all favorite coins for the user
      const favorites = await FavoriteCoin.find({ userId });

      // Find all coin history records based on the coin ID
      const coinHistory = await CoinHistory.find({ coinId });

      if (!coinHistory.length) {
          return res.status(404).json({ message: "No coin history found for this coin" });
      }

      // Respond with the found coin history
      res.status(200).json({
          message: "Coin history retrieved successfully",
          userId,
          favorites,
          coinHistory,
      });
  } catch (error) {
      console.error("Error retrieving coin history:", error); // Log the error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Function to save coin history from favorite coins
exports.saveCoinHistory = async (req, res) => {
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    // Fetch all favorite coins for the user
    const favorites = await FavoriteCoin.find({ userId });

    if (!favorites.length) {
      return res.status(404).json({ message: "No favorite coins found for this user" });
    }

    // Extract coin IDs from favorites
    const coinIds = favorites.map(fav => fav.coinId).join(',');

    // Fetch updates from CoinMarketCap API
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY, // Ensure API key is correctly set
      },
    });

    const coins = response.data.data;

    if (!coins || Object.keys(coins).length === 0) {
      return res.status(404).json({ message: "No coin data found" });
    }

    // Iterate over the coins and save only the quote data in CoinHistory
    for (const id of Object.keys(coins)) {
      const coin = coins[id];
      const coinQuote = coin.quote.USD;

      // Create and save a new CoinHistory entry with only the quote details
      const coinHistory = new CoinHistory({
        coinId: coin.id,
        price: coinQuote.price,
        volume_24h: coinQuote.volume_24h,
        percent_change_1h: coinQuote.percent_change_1h,
        percent_change_24h: coinQuote.percent_change_24h,
        percent_change_7d: coinQuote.percent_change_7d,
        percent_change_30d: coinQuote.percent_change_30d,
        percent_change_60d: coinQuote.percent_change_60d,
        percent_change_90d: coinQuote.percent_change_90d,
        market_cap: coinQuote.market_cap,
        fully_diluted_market_cap: coinQuote.fully_diluted_market_cap,
        lastUpdated: new Date(coin.last_updated),
      });

      // Save the coinHistory to the database
      const savedCoinHistory = await coinHistory.save(); 

      // Update the corresponding FavoriteCoin with the coinHistoryId
      await FavoriteCoin.findOneAndUpdate(
        { userId, coinId: coin.id }, // Match the favorite coin
        { coinHistoryId: savedCoinHistory._id } // Update with the coinHistory ID
      );
    }

    res.status(200).json({ message: "Coin quotes saved successfully" });
  } catch (error) {
    console.error("Error saving coin quotes:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
