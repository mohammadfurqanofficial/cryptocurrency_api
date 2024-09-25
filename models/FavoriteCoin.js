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
  coinHistoryIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoinHistory', // Reference to CoinHistory
  }],
});

module.exports = mongoose.model('FavoriteCoin', favoriteCoinSchema);
