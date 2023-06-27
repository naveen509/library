const mongoose = require('mongoose');

// Define the Book schema and model
const bookSchema = new mongoose.Schema({
    isbn: { type: String, required: true },
    category: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    likeCount: { type: Number, default: 0 },
  });
  
  const Book = mongoose.model('Book', bookSchema);

  module.exports = Book;