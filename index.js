const express = require('express');

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Welcome to the MPC API!');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
