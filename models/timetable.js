const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  duration: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  date: { type: Date, required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
});

const Timetable = mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;
