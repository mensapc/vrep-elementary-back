const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  _class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  attendance_status: {
    type: String,
    enum: ['Present', 'Absent', 'Tardy', 'Excused'],
    required: true,
  },
  reason: { type: String },
  comments: { type: String },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
