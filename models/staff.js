const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    default: 'staff',
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
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

  phone_number: {
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
  address: {
    type: String,
    required: true,
    trim: true,
  },

  photo: {
    type: String,
  },
  university_name: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  university_location: {
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
  _class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});

const StaffModel = mongoose.model('Staff', staffSchema);
module.exports = StaffModel;
