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
    default: "pupil",
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
  place_of_birth: {
    type: String,
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
  father_name: {
    type: String,
    required: true,
    trim: true,
  },
  father_phone: {
    type: String,
    trim: true,
  },
  father_nationality: {
    type: String,
    required: true,
    trim: true,
  },
  father_place_of_birth: {
    type: String,
    trim: true,
  },
  father_relationship: {
    type: String,
    trim: true,
    required: true,
  },
  mother_name: {
    type: String,
    required: true,
    trim: true,
  },
  mother_phone: {
    type: String,
    trim: true,
  },
  mother_nationality: {
    type: String,
    required: true,
    trim: true,
  },
  mother_place_of_birth: {
    type: String,
    trim: true,
  },
  mother_relationship: {
    type: String,
    trim: true,
    required: true,
  },
  parent_phone: {
    type: String,
    trim: true,
  },
  mother_address: {
    type: String,
    required: true,
  },
  _class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  photo: {
    type: String,
  },
});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
