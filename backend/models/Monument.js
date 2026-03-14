const mongoose = require('mongoose');

const monumentSchema = new mongoose.Schema({
    name: String,
    type: String,
    state: String,
    city: String,
    establishmentyear: String,
    timeneeded: String,
    reviewrating: Number,
    entrancefee: String,
    nearbyairport: String,
    weeklyoff: String,
    significance: String,
    besttimetovisit: String,
    imageurl: String,
    googlemapslink: String
});

module.exports = mongoose.model('Monument', monumentSchema);