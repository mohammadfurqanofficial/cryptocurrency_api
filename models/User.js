const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the FavoriteCoin schema
const favoriteSchema = new mongoose.Schema({
  coinId: {
    type: Number,
    required: true,
  },
  // You can add other properties related to favorite coins if necessary
}, { _id: false }); // Prevents creation of a separate _id for favorite coins

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteCoins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FavoriteCoin' }], // Array of favorite coin IDs
  isVerified: {
    type: Boolean,
    default: false, // Default to false until verified
  },
});

// Pre-save middleware to hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
