const mongoose = require("mongoose");

const TestScoreSchema = new mongoose.Schema({
 test_score: {
    type: Number,
    required: true,
  },
  student: {
    type: String,
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
});

const TestScoreModel = mongoose.model("TestScore", TestScoreSchema);
module.exports = TestScoreModel;