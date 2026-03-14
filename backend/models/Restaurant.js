const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    Name: String,
    Location: String,
    Locality: String,
    City: String,
    Cuisine: [String],
    Rating: Number,
    Votes: Number,
    Cost: Number
});

module.exports = mongoose.model('Restaurant', restaurantSchema);