const mongoose = require('mongoose');

const coinHistorySchema = new mongoose.Schema({
  coinId: { type: Number, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  rank: { type: Number, required: true },
  price: { type: Number, required: true },
  lastUpdated: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CoinHistory', coinHistorySchema);
