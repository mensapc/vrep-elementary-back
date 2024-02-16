const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }],
});

const QuestionModel = mongoose.model('Question', questionSchema);
module.exports = QuestionModel;
