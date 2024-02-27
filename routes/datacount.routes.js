const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { dataCountController, graphDataController } = require('../controllers/datacount.controller');

const router = express.Router();

router.get('/datacount', validateToken, dataCountController);
router.get('/graphdata', validateToken, graphDataController);

module.exports = router;
