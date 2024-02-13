const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
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
  choosen_option: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Option',
    required: true,
  },
});

const AnswerModel = mongoose.model('Model', answerSchema);

module.exports = AnswerModel;
