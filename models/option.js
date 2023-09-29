const { Schema, Model, SchemaTypes } = require("firefose");
const { String, Boolean } = SchemaTypes;

const optionSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  is_correct: {
    type: Boolean,
    required: true,
  },
  question_id: {
    type: String,
    required: true,
  },
});

const Option = new Model("options", optionSchema);
module.exports = Option;
