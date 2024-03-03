const Attendance = require('../models/attendance');

const calculateAttendance = (data) => {
  const attendance = {
    present_days: 0,
    total_days: 0,
    percentage: 100,
  };

  data.forEach((item) => {
    if (item.attendance_status === 'Present') {
      attendance.present_days += 1;
    }
    attendance.total_days += 1;
  });

  if (attendance.total_days > 0) {
    attendance.percentage = (attendance.present_days / attendance.total_days) * 100;
  }
  return attendance;
};

const updateAttendance = async (data, _id, res, next) => {
  try {
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      _id,
      {
        score: data.score,
        total: data.total,
        percentage: data.percentage,
      },
      { new: true }
    );
    return res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error(`Error updating attendance: ${error}`);
    next(error);
  }
};

module.exports = { calculateAttendance, updateAttendance };
