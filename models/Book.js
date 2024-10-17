const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    userId: String,
    comment: String,
    rating: Number
});

const BookSchema = new mongoose.Schema({
    isbn: { type: String, required: true, unique: true },
    title: String,
    author: String,
    reviews: [ReviewSchema]
});

module.exports = mongoose.model('Book', BookSchema);
