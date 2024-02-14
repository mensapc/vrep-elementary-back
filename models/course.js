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
  staff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' }],
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

