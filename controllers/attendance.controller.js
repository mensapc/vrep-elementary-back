const mongoose = require('mongoose');
const Attendance = require('../models/attendance');
const Student = require('../models/student');
const CustomError = require('../utils/CustomError');
const { updateAttendance } = require('../utils/utils.attendance');

class AttendanceController {
  createAttendance = async (req, res, next) => {
    const attendanceData = req.body;

    try {
      const attendance = await Attendance.find({
        _class: attendanceData._class,
        student: attendanceData.student,
      });
      if (attendance.length > 0) {
        return await updateAttendance(attendanceData, attendance[0]._id, res, next);
      } else {
        const newAttendance = await Attendance.create(attendanceData);
        res.status(201).json(newAttendance);
      }
    } catch (error) {
      console.error(`Error creating attendance: ${error}`);
      next(error);
    }
  };

  getClassAttendance = async (req, res, next) => {
    const { _class } = req.body;
    try {
      const attendance = await Student.aggregate([
        { $match: { _class: new mongoose.Types.ObjectId(_class) } },
        { $sort: { first_name: 1 } },
        {
          $lookup: {
            from: 'attendances',
            localField: '_id',
            foreignField: 'student',
            as: 'attendance',
          },
        },
        {
          $project: {
            first_name: 1,
            last_name: 1,
            attendance: 1,
          },
        },
        {
          $addFields: {
            first_name_initial: { $substr: ['$first_name', 0, 1] },
          },
        },
        {
          $group: {
            _id: '$first_name_initial',
            students: {
              $push: {
                first_name: '$first_name',
                last_name: '$last_name',
                attendance: '$attendance',
              },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]);
      // const attendance = await Student.aggregate([
      //   { $match: { _class: new mongoose.Types.ObjectId(_class) } },
      //   { $sort: { first_name: 1 } },
      //   {
      //     $lookup: {
      //       from: 'attendances',
      //       localField: '_id',
      //       foreignField: 'student',
      //       as: 'attendance',
      //     },
      //   },
      //   {
      //     $project: {
      //       first_name: 1,
      //       last_name: 1,
      //       attendance: 1,
      //     },
      //   },
      // ]);
      if (!attendance) throw new CustomError('Attendance not found', 404);
      res.status(200).json(attendance);
    } catch (error) {
      console.error(`Error getting attendance: ${error}`);
      next(error);
    }
  };

  getAttendanceBySearch = async (req, res, next) => {
    const query = req.query;
    try {
      const attendance = await Attendance.find(query);
      if (!attendance) throw new CustomError('Attendance not found', 404);

      const attendanceCount = calculateAttendance(attendance);
      res.status(200).json({
        ...attendanceCount,
        details: attendance,
      });
    } catch (error) {
      console.error(`Error getting attendance: ${error}`);
      next(error);
    }
  };
}

module.exports = AttendanceController;
