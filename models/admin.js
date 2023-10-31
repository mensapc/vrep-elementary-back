const { Schema, Model, SchemaTypes } = require("firefose");
const { String, Number } = SchemaTypes;

const adminSchema = new Schema({
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

  dob: {
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
});

const Admin = new Model("admins", adminSchema);
module.exports = Admin;
