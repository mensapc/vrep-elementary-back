const { Schema, Model, SchemaTypes } = require("firefose");
const { String, Number } = SchemaTypes;

const studentSchema = new Schema({
  reg_number: {
    type: String,
    required: true,
    unique: true,
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

  dob: {
    type: String,
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
});

const Student = new Model("students", studentSchema);
module.exports = Student;
