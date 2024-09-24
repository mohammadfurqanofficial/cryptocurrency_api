const axios = require('axios');
const CoinHistory = require('../models/CoinHistory');
const FavoriteCoin = require('../models/FavoriteCoin');

// Function to get updates for the user's favorite coins
exports.getCoinUpdates = async (req, res) => {
  const userId = req.user.id;
  try {
    const favoriteCoins = await FavoriteCoin.find({ userId });

    if (favoriteCoins.length === 0) {
      return res.status(404).json({ message: "No favorite coins to update" });
    }

    const coinIds = favoriteCoins.map((coin) => coin.coinId).join(',');
    
    const apiKey = process.env.COINMARKETCAP_API_KEY; // Use environment variable for API key
    const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`;
    
    const response = await axios.get(url, { headers: { 'X-CMC_PRO_API_KEY': apiKey } });
    const coinData = response.data.data;

    // Save the coin updates into CoinHistory
    const coinHistoryEntries = Object.values(coinData).map(coin => ({
      coinId: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      price: coin.quote.USD.price,
      lastUpdated: new Date(coin.last_updated),
    }));

    await CoinHistory.insertMany(coinHistoryEntries);

    res.status(200).json({ message: "Coin updates retrieved and saved", coinData });
  } catch (error) {
    console.error("Error fetching coin updates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
