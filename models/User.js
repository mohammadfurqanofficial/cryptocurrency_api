const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const favoriteSchema = new mongoose.Schema({
  coinId: { type: Number, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  rank: { type: Number, required: true },
});


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
  favorites: [favoriteSchema],
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

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
