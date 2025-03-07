const axios = require('axios');
const FavoriteCoin = require('../models/Coins');
const CoinHistory = require('../models/CoinHistory');
const User = require('../models/User');

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

// Function to download specific coin history by date
exports.getCoinHistoryDownload = async (req, res) => {
  try {
    const { coinId } = req.params;
    const { date } = req.query; // Expecting the date in the query string

    // Validate the date
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const targetDate = new Date(date);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    // Query the database for historical data of the coin on the specified date
    const coinHistory = await CoinHistory.find({
      coinId: coinId,
      createdAt: {
        $gte: targetDate, // Start of the day
        $lt: nextDay,     // End of the day
      },
    });

    if (!coinHistory || coinHistory.length === 0) {
      return res.status(404).json({ message: 'No data found for the specified date' });
    }

    // Return the coin history data in JSON format
    res.status(200).json(coinHistory); // Send raw data

  } catch (error) {
    console.error('Error fetching coin history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Function to get coin history for a specific coin or all favorite coins
exports.getCoinHistory = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const { coinId } = req.params; // Get the coin ID from the request parameters (optional)

  try {
    // Find the user and populate the favoriteCoins array, optionally filtering by coinId if provided
    const user = await User.findById(userId).populate({
      path: 'favoriteCoins',
      match: coinId ? { coinId } : {}, // Match specific coinId if provided, otherwise fetch all favorites
    });

    // Check if the user has any favorite coins
    if (!user || !user.favoriteCoins.length) {
      return res.status(404).json({ message: "No favorite coins found for this user" });
    }

    // Retrieve all coin history for the favorite coins
    const favorites = user.favoriteCoins;
    // console.log('Favorite data', favorites);

    // Extract all coin IDs from the favorite coins
    const favoriteCoinIds = favorites.map(fav => fav.coinId);
    // console.log('All Favorite Coin IDs:', favoriteCoinIds);

    // Find all coin history records based on the coin IDs
    const coinHistory = await CoinHistory.find({ coinId: { $in: favoriteCoinIds } });
    // console.log('Coin History Data:', coinHistory);

    if (!coinHistory.length) {
      return res.status(404).json({ message: "No coin history found for the favorite coins" });
    }

    // Map over the favorites and attach the corresponding history
    const coinsWithHistory = favorites.map(fav => {
      const historyForCoin = coinHistory.filter(history => history.coinId === parseInt(fav.coinId)); // Match history by coinId
      return {
        ...fav._doc, // Spread the favorite coin's properties
        coinHistory: historyForCoin, // Add the matching history for this coin
      };
    });

    // Respond with the found coin history and favorite coins
    res.status(200).json({
      message: "Coin history retrieved successfully",
      coin: coinsWithHistory, // Return the favorite coins with their corresponding history
    });
  } catch (error) {
    console.error("Error retrieving coin history:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Function to save coin history from favorite coins
exports.saveCoinHistory = async (req, res) => {
  try {
    // Fetch all favorite coins directly from the FavoriteCoin table
    const favoriteCoins = await FavoriteCoin.find();
    // console.log(favoriteCoins);
    // Check if there are any favorite coins
    if (!favoriteCoins.length) {
      return res.status(404).json({ message: "No favorite coins found" });
    }

    // Extract the coin IDs from favoriteCoins
    const coinIds = favoriteCoins.map(fav => fav.coinId).join(',');
    console.log("All Coin ID",coinIds);
    // Fetch updates from CoinMarketCap API
    const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY, // Ensure API key is correctly set
      },
    });

    const coins = response.data.data;
    // console.log("Response", coins);

    if (!coins || Object.keys(coins).length === 0) {
      return res.status(404).json({ message: "No coin data found" });
    }

    // Iterate over the coins and save the quote data to CoinHistory
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
      // console.log("Saved history", savedCoinHistory);

       // Update the corresponding FavoriteCoin with the coinHistoryId
      const fav_coin = await FavoriteCoin.findOneAndUpdate(
        { coinId: coin.id }, // Match the favorite coin
        { coinHistoryId: savedCoinHistory._id }, // Update with the coinHistory ID
        { new: true } // Return the updated document
      );
      console.log("Favorite coin saving function", fav_coin);
    }
    res.status(200).json({ message: "Coin quotes saved successfully"});
  } catch (error) {
    console.error("Error saving coin quotes:", error.response ? error.response.data : error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cron Job function
exports.saveHistoryCron = async (req, res) => {
  try {
    // Internally call the POST route to trigger the saveCoinHistory function
    const response = await axios.post(`${process.env.API_URL}/coins/save-history`);
    // console.log(response);
    res.status(200).json({ message: "Cron job triggered successfully", data: response.data });
  } catch (error) {
    console.error("Error triggering cron job:", error.message);
    res.status(500).json({ message: "Error triggering cron job", error: error.message });
  }
};