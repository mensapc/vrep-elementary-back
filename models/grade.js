const { Schema, Model, SchemaTypes } = require("firefose");
const { String, Number } = SchemaTypes;

const gradeSchema = new Schema({
  student_id: {
    type: String,
    required: true,
  },
  exam_id: {
    type: String,
    required: true,
  },
  grade_value: {
    type: String,
    required: true,
  },
});

const Grade = new Model("grades", gradeSchema);
module.exports = Grade;
