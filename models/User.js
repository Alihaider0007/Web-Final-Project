const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetToken: String,  // Token used for password reset
  resetTokenExpiry: Date  // Expiry time for the reset token
});

module.exports = mongoose.model('User', userSchema);
