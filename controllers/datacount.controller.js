const Student = require('../models/student');
const Staff = require('../models/staff');
const Event = require('../models/event');
const { getGraphData } = require('../utils/utils.datacount');

const dataCountController = async (req, res, next) => {
  try {
    const students = await Student.countDocuments();
    const staff = await Staff.countDocuments();
    const events = await Event.countDocuments();

    res.json({ students, staff, events });
  } catch (error) {
    console.error('Error counting data:', error);
    next(error);
  }
};

const graphDataController = async (req, res, next) => {
  try {
    const graphData = await getGraphData();

    res.json(graphData);
  } catch (error) {
    console.error('Error getting graph data:', error);
    next(error);
  }
};

module.exports = { dataCountController, graphDataController };
