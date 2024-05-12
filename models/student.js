const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  reg_number: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: "student",
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  _class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  phone_number:{
    type: String,
    required: true,
    trim: true
  },
  photo: {
    type: String,
  },
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
