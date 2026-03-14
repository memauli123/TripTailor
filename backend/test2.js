require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Restaurant.aggregate([
        {$group: {_id: '$City', avgRating: {$avg: '$Rating'}, count: {$sum: 1}}},
        {$sort: {avgRating: -1, count: -1}},
        {$limit: 5},
        {$project: {city: '$_id', avgRating: 1, count: 1, _id: 0}}
    ]);
    console.log('Restaurants:', result);
    mongoose.connection.close();
}

test();