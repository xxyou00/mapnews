const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
    name: String,
    imageUrl: String, 
    coordinates: [[Number]],
    center: [Number], 
});
module.exports = mongoose.model('city', citySchema);