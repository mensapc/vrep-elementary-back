const express = require('express');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');
const {
  dataCountController,
  graphDataController,
  staffDatacountController,
} = require('../controllers/datacount.controller');

const router = express.Router();

router.get('/datacount', validateToken, dataCountController);
router.get('/graphdata', validateToken, graphDataController);
router.post(
  '/datacount/staff',
  validateToken,
  authorize(['teacherData']),
  staffDatacountController
);

module.exports = router;
