const axios = require('axios');
const FavoriteCoin = require('../models/FavoriteCoin'); // Import the FavoriteCoin model
const CoinHistory = require('../models/CoinHistory'); // Import the CoinHistory model

// Function to get coin updates and save to CoinHistory
exports.getCoinUpdates = async (req, res) => {
  try {
    // Get all favorite coins for the user
    const favorites = await FavoriteCoin.find({ userId: req.user.id }); // Make sure to provide userId

    if (!favorites.length) {
      return res.status(404).json({ message: "No favorite coins found for this user" });
    }

    // Extract coin IDs
    const coinIds = favorites.map(fav => fav.coinId).join(',');

    // Fetch updates from CoinMarketCap API
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`, {
      headers: {
        'X-CMC_PRO_API_KEY': 'your_api_key', // Replace with your CoinMarketCap API key
      },
    });

    const coins = response.data.data;

    // Iterate over the coins and save their updates in CoinHistory
    for (const id of Object.keys(coins)) {
      const coin = coins[id];

      // Create a new CoinHistory entry
      const coinHistory = new CoinHistory({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        rank: coin.cmc_rank,
        price: coin.quote.USD.price,
        lastUpdated: new Date(coin.last_updated),
      });

      // Save the coin history entry
      await coinHistory.save();
    }

    // Respond with the updated coin history
    res.status(200).json({
      message: "Coin updates retrieved and saved successfully",
    });
  } catch (error) {
    console.error("Error retrieving coin updates:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
