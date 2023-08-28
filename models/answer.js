const { Schema, Model, SchemaTypes } = require("firefose");
const { String } = SchemaTypes;

const answerSchema = new Schema({
  question_id: {
    type: String,
    required: true,
  },
  option_id: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
  },
});

const Answer = new Model("answers", answerSchema);
module.exports = Answer;
