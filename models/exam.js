const mongoose = require("mongoose");

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  marks_per_question: {
    type: Number,
    required: true,
  },
  academic_year: {
    type: String,
    required: true,
  },
  school_term: {
    type: String,
    required: true,
    enum: ["1stterm", "2ndterm", "3rdterm"],
  },
  time_limit: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: true,
  },
  end_date: {
    type: Date,
    required: true,
  },
  staff: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Staff", required: true },
  ],
  course: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  ],
  _class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

const ExamModel = mongoose.model("Exam", examSchema);

module.exports = ExamModel;
