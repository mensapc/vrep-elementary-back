const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the RPMS API');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
