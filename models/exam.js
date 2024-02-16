const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  max_score: {
    type: Number,
    required: true,
  },
  time_limit: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  creator_id: {
    type: String,
    required: true,
  },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
});

const ExamModel = mongoose.model('Exam', examSchema);

module.exports = ExamModel;
