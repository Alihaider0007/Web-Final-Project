const mongoose = require('mongoose');

const myTourSchema = new mongoose.Schema({
    packageName: String,
    image: String,
    location: String,
    duration: String,
    price: String,
    description: String,
    meals: Boolean,
    hotel: Boolean,
    transport: Boolean,
    guide: Boolean,
    travelDate: String,
    status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('MyTour', myTourSchema);
