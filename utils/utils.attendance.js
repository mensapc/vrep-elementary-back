const Attendance = require('../models/attendance');
const Class = require('../models/class');

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

const attendedClass = async (_class) => {
  return await Class.findOne({ _id: _class }).select('name').populate({
    path: 'staff',
    select: 'first_name last_name',
  });
};

module.exports = { updateAttendance, attendedClass };
