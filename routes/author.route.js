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

    // Validate first name and last name
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      return res.status(400).json({ error: 'First name and last name should only contain letters' });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Validate contact number
const contactNoRegex = /^\d{10}$/;
if (!contactNoRegex.test(contactNo)) {
  return res.status(400).json({ error: 'Contact number should contain exactly 10 digits' });
}

    const author = await Author.create({ firstName, lastName, email, contactNo });
    res.status(201).json(author);
    logger.info('New author registered:', author);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register author' });
    logger.error('Failed to register author:', error);
  }
});

module.exports=router;