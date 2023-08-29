const Course = require('../models/course'); // Import the Course model
const CustomError = require('../utils/CustomError');

class CourseController {
    constructor() {
        this.course = new Course();
    }
    //Creates s course
    createCourse = async (req, res, next) => {
        try {
            const { courseData } = req.body; // Assuming you send the course data in the request body

            // Validate if required course data is provided
            if (!courseData) {
                throw new CustomError('subject name and description are required fields', 400);
            }

            const createdCourse = await this.course.createCourse(courseData); // Use this.course

            res.status(201).json({ course: createdCourse });
        } catch (error) {
            console.error('Error in creating course:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    // Get All Courses
    getAllCourses = async (req, res, next) => {
        try {
            const courses = await this.course.getAllCourses();
            res.status(200).json({ courses });
        } catch (error) {
            console.error('Error getting all courses:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    // Get Single Course
    getSingleCourse = async (req, res, next) => {
        const courseId = req.params.courseId;

        try {
            const courseData = await this.course.getCourseById(courseId);
            res.status(200).json({ course: courseData, });
        } catch (error) {
            console.error(`Error CourseID number ${courseId}: ${error}`);
            next(error);
        }
    };

    // Delete course by ID
    deleteCourseByID = async (req, res, next) => {
        try {
            const { courseID } = req.body;

            if (!courseID) {
                throw new CustomError(`Route: not able to get /${courseID}`, 400);
            }

            const deletedCourse = await this.course.deleteCourse(courseID);

        } catch (error) {
            console.error(`Error deleting student with registration number ${req.body.courseID}: ${error}`);
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
}

module.exports = CourseController;


