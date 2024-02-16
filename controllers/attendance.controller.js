const Attendance = require('../models/attendance');
const CustomError = require('../utils/CustomError');

class AttendanceController {
  createAttendance = async (req, res, next) => {
    const attendanceData = req.body;

    try {
      const newAttendance = await Attendance.create(attendanceData);
      if (!newAttendance) throw new CustomError('Attendance not created', 400);
      res.status(200).json(newAttendance);
    } catch (error) {
      console.error(`Error creating attendance: ${error}`);
      next(error);
    }
  };

  getAttendanceBySearch = async (req, res, next) => {
    const query = req.query;
    try {
      const attendance = await Attendance.find(query);
      if (!attendance) throw new CustomError('Attendance not found', 404);
      res.status(200).json(attendance);
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
