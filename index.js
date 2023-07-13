const express = require('express');
const authRoutes = require('./app/routes/auth.routes');
const cors = require('cors');
const errorMiddleware = require('./app/middlewares/error.middleware');
require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/', authRoutes);
app.use(errorMiddleware);

app.get('/', (req, res) => {
	res.send('Welcome to the MPC API!');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
