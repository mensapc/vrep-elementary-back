const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  notify: {
    type: String,
    enum: ['staff', 'students', 'parents', 'staff-students', 'all'],
    default: 'all',
  },
  location: {
    type: String,
  },
  duration: {
    type: String,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
