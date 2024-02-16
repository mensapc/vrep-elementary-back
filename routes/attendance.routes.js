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
// router.get(
//   "/attendance/students/:student_id",
//   validateToken,
//   attendanceController.getAttendanceByStudent
// );
// router.get(
//   "/attendance/courses/:course_id",
//   validateToken,
//   attendanceController.getAttendanceByCourse
// );

module.exports = router;
