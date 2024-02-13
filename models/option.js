const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  is_correct: {
    type: Boolean,
    required: true,
  },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
});

const OptionModel = mongoose.model('Option', optionSchema);
module.exports = OptionModel;
