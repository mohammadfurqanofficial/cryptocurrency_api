const mongoose = require('mongoose');

const favoriteCoinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  coinId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  rank: {
    type: Number,
    required: true,
  },
  coinHistoryId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CoinHistory' }] // Ensure this line is present
});

module.exports = mongoose.model('FavoriteCoin', favoriteCoinSchema);
