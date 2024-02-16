const Attendance = require('../models/attendance');

class AttendanceController {
  createAttendance = async (req, res, next) => {
    const attendanceData = req.body;

    try {
      const newAttendance = await Attendance.create(attendanceData);
      res.status(200).json(newAttendance);
    } catch (error) {
      console.error(`Error creating attendance: ${error}`);
      next(error);
    }
  };

  getAttendanceByStudent = async (req, res, next) => {
    const { student_id } = req.params;
    try {
      const query = new Query().where('student_id', '==', student_id);
      const attendance = await Attendance.find(query);
      res.status(200).json({ attendance });
    } catch (error) {
      console.error(`Error getting attendance: ${error}`);
      next(error);
    }
  };

  getAttendanceByCourse = async (req, res, next) => {
    const { course_id } = req.params;
    try {
      const query = new Query().where('course_id', '==', course_id);
      const attendance = await Attendance.find(query);
      res.status(200).json({ attendance });
    } catch (error) {
      console.error(`Error getting attendance: ${error}`);
      next(error);
    }
  };
}

module.exports = AttendanceController;
