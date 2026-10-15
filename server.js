const express = require('express');
const mongoose = require('mongoose');
const Book = require('./bookModel');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/bookstoreDB')
    .then(() => {
        console.log('MongoDB connected successfully');

        app.listen(3000, () => {
            console.log('Server running at http://localhost:3000');
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });

// 1. CREATE: Add a new book
app.post('/api/books', async (req, res, next) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        next(error);
    }
});

// 2. READ ALL: Get all books
app.get('/api/books', async (req, res, next) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        next(error);
    }
});

// 3. READ SINGLE: Get a book by ISBN
app.get('/api/books/:isbn', async (req, res, next) => {
    try {
        const book = await Book.findOne({
            isbn: req.params.isbn
        });

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.json(book);
    } catch (error) {
        next(error);
    }
});

// 4. UPDATE: Update a book by ISBN
app.put('/api/books/:isbn', async (req, res, next) => {
    try {
        const book = await Book.findOneAndUpdate(
            { isbn: req.params.isbn },
            req.body,
            { new: true, runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.json(book);
    } catch (error) {
        next(error);
    }
});

// 5. DELETE: Delete a book by ISBN
app.delete('/api/books/:isbn', async (req, res, next) => {
    try {
        const book = await Book.findOneAndDelete({
            isbn: req.params.isbn
        });

        if (!book) {
            return res.status(404).json({
                message: 'Book not found'
            });
        }

        res.json({
            message: 'Book deleted successfully',
            book
        });
    } catch (error) {
        next(error);
    }
});

// Error handling
app.use((error, req, res, next) => {
    if (error.code === 11000) {
        return res.status(409).json({
            message: 'ISBN already exists'
        });
    }

    if (error.name === 'ValidationError' ||
        error.name === 'CastError') {
        return res.status(400).json({
            message: error.message
        });
    }

    console.error(error);
    res.status(500).json({
        message: 'Internal server error'
    });
});