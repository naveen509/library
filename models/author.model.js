const mongoose = require('mongoose');

// Define the Author schema and model
const authorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
  });
  
  const Author = mongoose.model('Author', authorSchema);

  module.exports = Author;