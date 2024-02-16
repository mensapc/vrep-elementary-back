const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  grade: { type: String, default: '' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
});

const GradeModel = mongoose.model('Grade', gradeSchema);
module.exports = GradeModel;
