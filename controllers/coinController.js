const axios = require('axios');
const FavoriteCoin = require('../models/FavoriteCoin'); // Import the FavoriteCoin model
const CoinHistory = require('../models/CoinHistory'); // Import the CoinHistory model

// Function to get coin updates and save to CoinHistory
exports.getCoinUpdates = async (req, res) => {
    const userId = req.user.id; // Get the user ID from the authenticated user
  try {
    // Get all favorite coins for the user
    const favorites = await FavoriteCoin.find({ userId }); // Make sure to provide userId
    console.log(favorites);

    if (!favorites.length) {
      return res.status(404).json({ message: "No favorite coins found for this user" });
    }

    // Extract coin IDs
    const coinIds = favorites.map(fav => fav.coinId).join(',');
    console.log(coinIds);

    // Fetch updates from CoinMarketCap API
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY, // Make sure to set this in your .env file
      },
    });

    const coins = response.data.data;
    console.log(coins);
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
