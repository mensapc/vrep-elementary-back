const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  academic_year: { type: String, required: true },
  school_term: { type: String, required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  _class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
});

const ResultModel = mongoose.model('Result', resultSchema);
module.exports = ResultModel;
