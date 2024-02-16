const Student = require('../models/student');
const Staff = require('../models/staff');
const Event = require('../models/event');

const dataCountController = async (req, res, next) => {
  try {
    const students = await Student.countDocuments();
    const staff = await Staff.countDocuments();
    const events = await Event.countDocuments();

    res.json({ students, staff, events });
  } catch (error) {
    console.error('Error counting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = dataCountController;
