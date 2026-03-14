require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Restaurant = require('./models/Restaurant');
const Monument = require('./models/Monument');

async function importData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Import restaurants
        const restaurantsData = JSON.parse(fs.readFileSync('../datasets/restaurants.json', 'utf8'));
        await Restaurant.insertMany(restaurantsData);
        console.log('Restaurants imported');

        // Import monuments
        const monumentsData = JSON.parse(fs.readFileSync('../datasets/monuments.json', 'utf8'));
        await Monument.insertMany(monumentsData);
        console.log('Monuments imported');

        console.log('Data import completed');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        mongoose.connection.close();
    }
}

importData();