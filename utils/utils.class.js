const Class = require('../models/class');
const Course = require('../models/course');
const CustomError = require('./CustomError');

const checkIfCourseAlreadyAdded = async (_class, course, session) => {
  const classWithCourse = await Class.findOne({ _id: _class, 'courses.course': course }).session(
    session
  );
  if (classWithCourse) throw new CustomError('Course already added to class', 400);
};

const addStaffToCourse = async (courseId, staff, session) => {
  const courseWithStaff = await Course.findOne({ _id: courseId, staff }).session(session);
  if (!courseWithStaff) {
    await Course.findOneAndUpdate({ _id: courseId }, { $push: { staff } }).session(session);
  }
};

module.exports = { checkIfCourseAlreadyAdded, addStaffToCourse };
