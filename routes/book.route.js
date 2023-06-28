const express = require('express');
const router = express();
const Author = require("../models/author.model")
const Book = require("../models/book.model")
const schedule = require('node-schedule');
const fs = require('fs');
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs.log' }),
    ],
  });  

// Register a new book
router.post('/', async (req, res) => {
  try {
    const { isbn, category, title, authorId } = req.body;
    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    // Validate ISBN
    const isbnRegex = /^[a-zA-Z0-9]+$/;
    if (!isbnRegex.test(isbn)) {
      return res.status(400).json({ error: 'ISBN should only contain alphanumeric characters' });
    }

    // Validate category
    if (!category) {
      return res.status(400).json({ error: 'Category is required' });
    }

    // Validate title
    const titleRegex = /^[a-zA-Z0-9]+$/;
    if (!titleRegex.test(title)) {
      return res.status(400).json({ error: 'Title should only contain alphanumeric characters' });
    }

    const book = await Book.create({ isbn, category, title, author });
    res.status(201).json(book);
    logger.info('New book registered:', book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register book' });
    logger.error('Failed to register book:', error);
  }
});

  // Search a book by ISBN
  router.get('/book/:isbn', async (req, res) => {
    try {
      const book = await Book.findOne({ isbn: req.params.isbn }).populate('author');
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      res.json(book);
      logger.info('Book retrieved:', book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve book' });
      logger.error('Failed to retrieve book:', error);
    }
  });
  
  // Like a book
  router.post('/book/like/:isbn', async (req, res) => {
    try {
      const book = await Book.findOne({ isbn: req.params.isbn });
      if (!book) {
        return res.status(404).json({ error: 'Book not found' });
      }
      book.likeCount += 1;
      await book.save();
      res.json({ message: 'Book liked' });
      logger.info('Book liked:', book);
    } catch (error) {
      res.status(500).json({ error: 'Failed to like book' });
      logger.error('Failed to like book:', error);
    }
  });
  
  // Generate report every 5 minute
  schedule.scheduleJob('*/1 * * * *', async () => {
    try {
      const authors = await Author.find();
      const reportData = authors.map((author) => ({
        authorId: author._id,
        authorName: `${author.firstName} ${author.lastName}`,
        likeCount: 0,
      }));
  
      const books = await Book.find();
      books.forEach((book) => {
        const authorIndex = reportData.findIndex((data) => data.authorId.equals(book.author));
        if (authorIndex !== -1) {
          reportData[authorIndex].likeCount += book.likeCount;
        }
      });
  
      // Generate report file
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const reportFilename = `../Backend/report_${timestamp}.txt`;
      const reportContent = reportData
        .map((data) => `${data.authorName}: ${data.likeCount} likes`)
        .join('\n');
  
      fs.writeFile(reportFilename, reportContent, (err) => {
        if (err) {
          console.error('Failed to generate report:', err);
          logger.error('Failed to generate report:', err);
        } else {
          console.log(`Report generated: ${reportFilename}`);
          logger.info('Report generated:', reportFilename);
        }
      });
    } catch (error) {
      console.error('Failed to generate report:', error);
      logger.error('Failed to generate report:', error);
    }
  });

  module.exports = router;