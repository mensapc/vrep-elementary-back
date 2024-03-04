const express = require('express');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');
const {
  dataCountController,
  graphDataController,
  staffDatacountController,
  studentDatacountController,
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

router.post(
  '/datacount/student',
  validateToken,
  authorize(['studentData']),
  studentDatacountController
);

module.exports = router;
