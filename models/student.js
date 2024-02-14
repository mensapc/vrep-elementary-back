const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  reg_number: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: 'pupil',
  },

  email: {
    type: String,
    required: true,
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

  age: {
    type: Number,
    required: true,
    trim: true,
  },

  address: {
    type: String,
    required: true,
    trim: true,
  },

  health_condition: {
    type: String,
    required: true,
    trim: true,
  },

  parent_name: {
    type: String,
    required: true,
    trim: true,
  },

  parent_phone: {
    type: String,
    required: true,
    trim: true,
  },

  parent_occupation: {
    type: String,
    required: true,
    trim: true,
  },
  _class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
});

const StudentModel = mongoose.model('Student', studentSchema);
module.exports = StudentModel;
