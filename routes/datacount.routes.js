const express = require('express');
const { validateToken } = require('../middlewares/validations');
const dataCountController = require('../controllers/datacount.controller');

const router = express.Router();

router.get('/datacount', validateToken, dataCountController);

module.exports = router;
