const express = require('express');
const router = express();
const Author = require("../models/author.model")
const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'logs.log' }),
    ],
  });  

// Register a new author
router.post('/author', async (req, res) => {
    try {
      const { firstName, lastName, email, contactNo } = req.body;
      const author = await Author.create({ firstName, lastName, email, contactNo });
      res.status(201).json(author);
      logger.info('New author registered:', author);
    } catch (error) {
      res.status(500).json({ error: 'Failed to register author' });
      logger.error('Failed to register author:', error);
    }
  });

  module.exports = router;