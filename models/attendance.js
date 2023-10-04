const { Schema, Model, SchemaTypes } = require("firefose");
const { String, Number } = SchemaTypes;

const attendanceSchema = new Schema({
  student_id: {
    type: String,
    required: true,
  },
  course_id: {
    type: String,
    required: true,
  },
  attendance_value: {
    type: Number,
    required: true,
  },
  total_attendance: {
    type: Number,
    required: true,
  },
});

const Attendance = new Model("attendances", attendanceSchema);
module.exports = Attendance;
