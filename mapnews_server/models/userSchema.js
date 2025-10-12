const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    favorites: {
        news: [{ type: mongoose.Schema.Types.ObjectId, ref: 'news' }],
        sources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'source' }],
        cities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'city' }]
    }
});

module.exports = mongoose.model('user', userSchema);