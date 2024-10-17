const express = require('express');
const Book = require('../models/Book');
const { authenticateJWT } = require('../middleware/auth');
const router = express.Router();

// Get all books
router.get('/', async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// Get book by ISBN
router.get('/:isbn', async (req, res) => {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
});

// Add or modify review
router.post('/:isbn/reviews', authenticateJWT, async (req, res) => {
    const { rating, comment } = req.body;
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) return res.status(404).send('Book not found');

    let review = book.reviews.find(r => r.userId === req.user._id);
    if (review) {
        // Modify existing review
        review.rating = rating;
        review.comment = comment;
    } else {
        // Add new review
        book.reviews.push({ userId: req.user._id, rating, comment });
    }

    await book.save();
    res.json(book);
});

// Delete review
router.delete('/:isbn/reviews/:reviewId', authenticateJWT, async (req, res) => {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) return res.status(404).send('Book not found');

    const reviewIndex = book.reviews.findIndex(r => r._id.toString() === req.params.reviewId && r.userId === req.user._id);
    if (reviewIndex === -1) return res.status(403).send('Cannot delete this review');

    book.reviews.splice(reviewIndex, 1);
    await book.save();
    res.json(book);
});

module.exports = router;
