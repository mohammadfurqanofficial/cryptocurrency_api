const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to get data from CoinMarketCap API
router.get('/allcoins', async (req, res) => {
  try {
    const { start = 1, limit = 3000, sort_by = "cmc_rank" } = req.query; // Default params
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', {
      params: {
        start: start,
        limit: limit,
        sort: sort_by
      },
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY, // Make sure to set this in your .env file
      },
    });

    res.json(response.data); // Send the response data back
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching data from CoinMarketCap API' });
  }
});

module.exports = router;
