const axios = require('axios');
const FavoriteCoin = require('../models/FavoriteCoin');
const CoinHistory = require('../models/CoinHistory');

// Function to get coin updates and save to CoinHistory
exports.getCoinUpdates = async (req, res) => {
  const userId = req.user ? req.user.id : null;

  if (!userId) {
    return res.status(400).json({ message: "Invalid user" });
  }

  try {
    // Fetch all favorite coins for the user
    const favorites = await FavoriteCoin.find({ userId });
    console.log("Favorite Coins:", favorites);

    if (!favorites.length) {
      return res.status(404).json({ message: "No favorite coins found for this user" });
    }

    // Extract coin IDs
    const coinIds = favorites.map(fav => fav.coinId).join(',');
    console.log("Coin IDs:", coinIds);

    // Fetch updates from CoinMarketCap API
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY, // Ensure API key is correctly set
      },
    });

    console.log("API Response Data:", response.data);
    const coins = response.data.data;

    // Check if coins data exists
    if (!coins || Object.keys(coins).length === 0) {
      return res.status(404).json({ message: "No coin data found" });
    }

    // Iterate over the coins and save their updates in CoinHistory
    for (const id of Object.keys(coins)) {
      const coin = coins[id];

      // Create and save a new CoinHistory entry
      const coinHistory = new CoinHistory({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        rank: coin.cmc_rank,
        price: coin.quote.USD.price,
        lastUpdated: new Date(coin.last_updated),
      });

      console.log("Saving coin history:", coinHistory);
      await coinHistory.save();
    }

    res.status(200).json({ message: "Coin updates retrieved and saved successfully" });
  } catch (error) {
    console.error("Error retrieving coin updates:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
