const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  city: String,
  location: String,
  date: String,
  time: String,
  organizer: String,
  image: String
});

module.exports = mongoose.model('Event', eventSchema);
