const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  score: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  _class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
