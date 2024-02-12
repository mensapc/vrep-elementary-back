const mongoose = require('mongoose');

const connectDB = (url) => {
	mongoose.set('strictQuery', true);
	mongoose
		.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => console.log('MongoDB connected'))
		.catch((error) => console.error('Error connecting to MongoDB:', error));
};

module.exports = connectDB;
