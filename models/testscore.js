const mongoose = require("mongoose");

const TestScoreSchema = new mongoose.Schema({
 welcome_test: {
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
  mid_term_test:{
    type: Number,
  },
  overall:{
    type: Number,
  }
});

const TestScoreModel = mongoose.model("TestScore", TestScoreSchema);
module.exports = TestScoreModel;