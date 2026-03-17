const mongoose = require('mongoose');
const sourceSchema = new mongoose.Schema({
    title: String,
    imageUrl: String,
    siteUrl: String,
    description: String
});
module.exports = mongoose.model('source', sourceSchema);