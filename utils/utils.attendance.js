const Attendance = require('../models/attendance');

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

module.exports = { updateAttendance };
