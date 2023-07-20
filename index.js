const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./app/middlewares/error.middleware');
require('dotenv').config();
const authRoutes = require('./app/routes/auth.routes');
const studentRoutes = require('./app/routes/student.routes');

const app = express();
const port = process.env.SERVER_PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/', authRoutes);
app.use('/api/v1', studentRoutes)

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to the MPC API!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});