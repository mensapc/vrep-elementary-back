const mongoose = require('mongoose');

const HeadTeacherSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    default: 'headTeacher',
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
  dob :  {
    type: String,
    required: true,
    trim: true,
  },
  state_of_origin :  {
    type: String,
    required: true,
    trim: true,
  },
  university : {
    type: String,
    required: true,
    trim: true,
  },
  educationLevel: {
    type: String,
    enum: ['Highschool', 'Undergraduate', 'Masters', 'HND', 'ND', 'NCE'],
    required: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  phone_number: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    type: String,
  },
  _class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  
},  { versionKey: false });

const HeadTeacher = mongoose.model('HeadTeacher', HeadTeacherSchema);
module.exports = HeadTeacher;