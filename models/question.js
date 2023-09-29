const { Schema, Model, SchemaTypes } = require("firefose");
const { String, Number } = SchemaTypes;

const questionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
  exam_id: {
    type: String,
    required: true,
  },
});

const Question = new Model("questions", questionSchema);
module.exports = Question;
