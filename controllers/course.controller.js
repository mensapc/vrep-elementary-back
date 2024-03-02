const Course = require('../models/course');
const CustomError = require('../utils/CustomError');

class CourseController {
  createCourse = async (req, res, next) => {
    try {
      const { name, staff, _class } = req.body;
      const course = await Course.create({ name, staff, _class });
      res.status(200).json(course);
    } catch (error) {
      console.error(`Error creating course and referencing class: ${error}`);
      next(error);
    }
  };

  addTeacherToCourse = async (req, res, next) => {
    try {
      const { course, staff } = req.body;

      const staffExists = await Course.find({ staff: staff });
      if (staffExists.length) throw new CustomError('this teacher already exists in course', 400);
      const newCourse = await Course.findByIdAndUpdate(
        course,
        { $push: { staff: staff } },
        { new: true }
      );
      if (!newCourse) throw new CustomError('course not found', 404);
      res.status(200).json(newCourse);
    } catch (error) {
      console.error(`Error adding teacher to course: ${error}`);
      next(error);
    }
  };

  removeTeacherFromCourse = async (req, res, next) => {
    try {
      const { course, staff } = req.body;
      const newCourse = await Course.findByIdAndUpdate(
        course,
        { $pull: { staff: staff } },
        { new: true }
      );
      if (!newCourse) throw new CustomError('course not found', 404);
      res.status(200).json(newCourse);
    } catch (error) {
      console.error(`Error removing teacher from course: ${error}`);
      next(error);
    }
  };

  // Get All Courses
  getCourses = async (req, res, next) => {
    try {
      const courses = await Course.find();
      if (!courses) {
        throw new CustomError('No Course found .', 404);
      }
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error getting courses:', error);
      next(error);
    }
  };

  // Get courses by search
  getCoursesBySearch = async (req, res, next) => {
    const data = req.query;
    try {
      const courses = await Course.find(data).populate([
        { path: '_class', select: 'name' },
        { path: 'staff', select: 'first_name last_name' },
      ]);
      if (!courses) {
        throw new CustomError('No Course found .', 404);
      }
      res.status(200).json(courses);
    } catch (error) {
      console.error('Error getting courses:', error);
      next(error);
    }
  };

  // Get Single Course
  getCourse = async (req, res, next) => {
    const { id } = req.params;

    try {
      const course = await Course.findById(id);
      if (!course) {
        throw new CustomError('Course not found', 404);
      }
      res.status(200).json(course);
    } catch (error) {
      console.error(`Error CourseID number ${id}: ${error}`);
      next(error);
    }
  };

  deleteCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
      const courseToDelete = await Course.findByIdAndDelete(id);
      if (!courseToDelete) {
        throw new CustomError('Course not found', 404);
      }
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error(`Error deleting course with ID ${req.params.courseID}: ${error}`);
      next(error);
    }
  };

  updateCourse = async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { name, description },
        { new: true }
      );
      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error(`Error updating course: ${error}`);
      next(error);
    }
  };
}

module.exports = CourseController;

