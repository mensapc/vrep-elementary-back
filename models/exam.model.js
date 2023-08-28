const { Schema } = require("firefose");
const { Model } = require("firefose");
const { SchemaTypes } = require("firefose");
const { String } = SchemaTypes;

const examSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    teacher_id: {
      type: String,
      required: true,
    },
    max_score: {
      type: String,
      required: true,
    },
    time_limit: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

const Exam = new Model("exams", examSchema);

module.exports = Exam;
