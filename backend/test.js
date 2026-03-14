require('dotenv').config();
const mongoose = require('mongoose');
const Monument = require('./models/Monument');

async function test() {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Monument.aggregate([
        {$group: {_id: '$city', avgRating: {$avg: '$reviewrating'}, count: {$sum: 1}, imageurl: {$first: '$imageurl'}}},
        {$sort: {avgRating: -1, count: -1}},
        {$limit: 6},
        {$project: {city: '$_id', avgRating: 1, count: 1, imageurl: 1, _id: 0}}
    ]);
    console.log('Top cities:', JSON.stringify(result, null, 2));
    mongoose.connection.close();
}

test();