const mongoose = require('mongoose');

const FavoriteCoinSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  coinId: { 
    type: Number, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  symbol: { 
    type: String, 
    required: true 
  },
  rank: { 
    type: Number, 
    required: true 
  },
  coinHistoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'CoinHistory' // Reference to CoinHistory model
  }
}, { timestamps: true });

module.exports = mongoose.model('FavoriteCoin', FavoriteCoinSchema);
