const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true,
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  chosen_option: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: true,
  },
});

const AnswerModel = mongoose.model('Answer', answerSchema);

module.exports = AnswerModel;
