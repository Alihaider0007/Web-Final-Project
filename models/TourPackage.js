const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  city: String,
  location: String,

  // Store number of days as a number
  duration: {
    type: Number,
    required: true
  },
  // Optional: store original string label if needed
  durationLabel: String,

  // Price stored as a number for filtering
  price: {
    type: Number,
    required: true
  },

  image: String,

  meals: {
    type: Boolean,
    default: false
  },
  hotel: {
    type: Boolean,
    default: false
  },
  transport: {
    type: Boolean,
    default: false
  },
  guide: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('TourPackage', tourPackageSchema);
