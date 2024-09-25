const mongoose = require('mongoose');

const coinHistorySchema = new mongoose.Schema({
  coinId: { type: Number, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  rank: { type: Number, required: true },
  price: { type: Number, required: true },
  volume_24h: { type: Number, required: true },            // Added volume_24h field
  percent_change_1h: { type: Number, required: true },      // Added percent change fields
  percent_change_24h: { type: Number, required: true },
  percent_change_7d: { type: Number, required: true },
  percent_change_30d: { type: Number, required: true },
  percent_change_60d: { type: Number, required: true },
  percent_change_90d: { type: Number, required: true },
  market_cap: { type: Number, required: true },             // Added market cap field
  fully_diluted_market_cap: { type: Number, required: true }, // Added fully diluted market cap
  lastUpdated: { type: Date, required: true },              // Coin's last update timestamp from API
}, { timestamps: true });

module.exports = mongoose.model('CoinHistory', coinHistorySchema);
