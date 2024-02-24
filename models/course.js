const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
  },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  _class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

