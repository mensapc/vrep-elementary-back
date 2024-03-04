const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');
const AttendanceController = require('../controllers/attendance.controller');

const router = express.Router();
const attendanceController = new AttendanceController();

router.post(
  '/attendance',
  validateToken,
  authorize(['createAttendance']),
  attendanceController.createAttendance
);
router.post('/attendance/search', validateToken, attendanceController.getAttendanceBySearch);

router.post(
  '/attendance/class',
  validateToken,
  authorize(['readAttendance']),
  attendanceController.getClassAttendance
);

module.exports = router;
