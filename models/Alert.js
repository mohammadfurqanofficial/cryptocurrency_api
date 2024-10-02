// models/Alert.ts

import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coinId: {
    type: String,  // CoinMarketCap ID or custom ID for the coin
    required: true,
  },
  priceThreshold: {
    type: Number,
    required: true,
  },
  volumeThreshold: {
    type: Number,
    required: true,
  },
  notified: {
    type: Boolean,
    default: false,  // Set to true after sending the email
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Alert", AlertSchema);
