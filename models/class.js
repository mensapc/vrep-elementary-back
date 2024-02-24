const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  courses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    },
  ],
});

const ClassModel = mongoose.model('Class', classSchema);
module.exports = ClassModel;

