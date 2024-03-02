const Student = require('../models/student');
const Staff = require('../models/staff');
const Event = require('../models/event');
const Course = require('../models/course');
const Exam = require('../models/exam');
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

const staffDatacountController = async (req, res, next) => {
  const { staff, _class } = req.body;
  try {
    const students = await Student.find({ _class: _class }).countDocuments();
    const courses = await Course.find({ staff: staff, _class: _class }).countDocuments();
    const exams = await Exam.find({ staff: staff, _class: _class }).countDocuments();
    res.json({
      students,
      courses,
      exams,
    });
  } catch (error) {
    console.error('Error counting data:', error);
    next(error);
  }
};

const studentDatacountController = (req, res, next) => {
  const { id } = req.body;
};

module.exports = { dataCountController, graphDataController, staffDatacountController };
