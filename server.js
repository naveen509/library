const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');

const app = express();
app.use(express.json());
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://user123:W1tvk6niSD3NsiXj@cluster0.oixenxj.mongodb.net/publications", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    winston.info('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    // winston.error('MongoDB connection error:', error);
  });

// Configure Winston logger
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs.log' }),
  ],
});

// Start the server
const port = 8060
app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  logger.info(`Server is running on http://localhost:${port}`);
  // console.log(`Server is running on http://localhost:${process.env.PORT}`);
  // logger.info(`Server is running on http://localhost:${process.env.PORT}`);
});

app.use("/authors", require("./routes/author.route"))
app.use("/books", require("./routes/book.route"))
