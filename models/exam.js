const { Schema } = require("firefose");
const { Model } = require("firefose");
const { SchemaTypes } = require("firefose");
const { String, Number } = SchemaTypes;

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
    staff_id: {
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
  },
  { timestamp: true }
);

const Exam = new Model("exams", examSchema);

module.exports = Exam;
