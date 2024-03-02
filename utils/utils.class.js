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

const classWithPopulatedData = async (id) => {
  return Class.findById(id)
    .populate({
      path: 'courses',
      populate: [
        { path: 'course', select: 'name' },
        { path: 'staff', select: 'first_name last_name email phone_number' },
      ],
    })
    .populate({ path: 'staff', select: 'first_name last_name email phone_number' });
};

const updateClassStaff = async (id, staff) => {
  const updatedClass = await Class.findByIdAndUpdate(id, { staff }, { new: true });
  return updatedClass;
};

module.exports = {
  checkIfCourseAlreadyAdded,
  addStaffToCourse,
  classWithPopulatedData,
  updateClassStaff,
};
