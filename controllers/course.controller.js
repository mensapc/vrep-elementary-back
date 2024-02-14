const Course = require('../models/course');
const CustomError = require('../utils/CustomError');

class CourseController {
  createCourse = async (req, res, next) => {
    try {
      const { name, description } = req.body;
      const course = await Course.create({ name, description });
      res.status(200).json(course);
    } catch (error) {
      console.error(`Error creating course and referencing class: ${error}`);
      next(error);
    }
  };
  // Get All Courses
  getAllCourses = async (req, res, next) => {
    try {
      const courses = await this.course.getAllCourses();
      res.status(200).json({ courses });
    } catch (error) {
      console.error('Error getting all courses:', error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  // Get Single Course
  getSingleCourse = async (req, res, next) => {
    const courseId = req.params.courseId;

    try {
      const courseData = await this.course.getCourseById(courseId);
      res.status(200).json({ course: courseData });
    } catch (error) {
      console.error(`Error CourseID number ${courseId}: ${error}`);
      next(error);
    }
  };

  // Delete course by ID
  deleteCourseByID = async (req, res, next) => {
    try {
      const courseID = req.params.courseID;

      if (!courseID) {
        throw new CustomError('Invalid course ID provided in the request.', 400);
      }

      const deletedCourse = await this.course.deleteCourse(courseID);

      if (deletedCourse) {
        // Course deletion was successful
        return res.status(200).json({ message: 'Deleted successfully' });
      } else {
        // Course not found or not deleted
        return res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error(`Error deleting course with ID ${req.params.courseID}: ${error}`);
      next(error);
    }
  };

  // Controller function to update a course by ID
  updateCourseByID = async (req, res, next) => {
    try {
      const courseID = req.params.courseID; // Get the course ID from the request params
      const updatedData = req.body; // Updated data from the request body

      const updatedCourse = await this.course.updateCourseByID(courseID, updatedData);

      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error(`Error updating course: ${error}`);
      next(error);
    }
  };

  // Create course Scheme
  createCourseSchemData = async (req, res, next) => {
    try {
      const courseSchemeData = req.body; // Class data from the request body

      const staffID = courseSchemeData.staff_id; // Get staff_id from class data scheme

      // Ensure staff with the provided staff_id exists
      const staffExists = await this.staff.getStaffById(staffID);
      if (!staffExists) {
        throw new CustomError('Staff with the provided staff_id not found.', 404);
      }
      delete staffExists.password;

      // Added the "created_At" field to classSchemeData
      courseSchemeData.created_At = formatCurrentDate();

      // Create the class scheme and reference the staff_id
      const createdScheme = await this.course.createCourseSchem(courseSchemeData, staffID);

      // A validation check to ensure required entities
      if (!createdScheme) {
        throw new CustomError('Course Scheme details and staff_id not found.', 404);
      }

      const response = {
        CourseSchema: createdScheme,
        staff: staffExists,
      };
      res.status(201).json(response);
    } catch (error) {
      console.error(`Error creating course scheme and referencing staff: ${error}`);
      next(error);
    }
  };

  // controller to get all courses scheme
  getCourseSchemes = async (req, res, next) => {
    try {
      const courses = await this.course.getAllCourseSchemes();
      if (!courses) {
        throw new CustomError('No Course Scheme found .', 404);
      }
      res.status(200).json({ courses });
    } catch (error) {
      console.error('Error getting all courses:', error);
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  };

  //  controller to update a course scheme
  updateCourseScheme = async (req, res, next) => {
    try {
      const courseScheme_ID = req.params.courseScheme_ID; // Get the course ID from the request params
      const updatedData = req.body; // Updated data from the request body

      const updatedCourse = await this.course.updateCourseSchemeByID(courseScheme_ID, updatedData);
      if (!updatedCourse) {
        throw new CustomError(`Course scheme with this ID ${courseScheme_ID} not found .`, 404);
      }
      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error(`Error updating course: ${error}`);
      next(error);
    }
  };
}

module.exports = CourseController;

