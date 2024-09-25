const axios = require('axios');
const FavoriteCoin = require('../models/FavoriteCoin');
const CoinHistory = require('../models/CoinHistory');

// Function to save coin history
exports.saveCoinHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const favorites = await FavoriteCoin.find({ userId });
    
    if (!favorites.length) {
      return res.status(404).json({ message: "No favorite coins found for this user" });
    }

    const coinIds = favorites.map(fav => fav.coinId).join(',');

    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
      },
    });

    const coins = response.data.data;

    for (const id in coins) {
      const coin = coins[id];
      const coinHistory = new CoinHistory({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        rank: coin.cmc_rank,
        price: coin.quote.USD.price,
        lastUpdated: new Date(coin.last_updated),
      });

      await coinHistory.save();
    }

    res.status(200).json({ message: "Coin history saved successfully!" });
  } catch (error) {
    console.error("Error saving coin history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
