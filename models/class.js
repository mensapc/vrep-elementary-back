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
});

const ClassModel = mongoose.model('Class', classSchema);
module.exports = ClassModel;

