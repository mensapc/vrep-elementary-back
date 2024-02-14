const mongoose = require('mongoose');
const TimeStampMiddleware = require('../middlewares/timestamp');
const connectDB = (url) => {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(url)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('Error connecting to MongoDB:', error));
};

mongoose.plugin((schema) => {
  TimeStampMiddleware(schema);
});

module.exports = connectDB;
