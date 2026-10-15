const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title required'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Author required'],
        trim: true
    },
    isbn: {
        type: String,
        required: [true, 'ISBN required'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Price required'],
        min: 0
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    genre: [String],
    publishedYear: Number
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);