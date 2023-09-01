const Course = require('../models/course'); // Import the Course model
const Class = require('../models/class')
const CustomError = require('../utils/CustomError');

class CourseController {
    constructor() {
        this.course = new Course();
        this.class = new Class()
    }
    // Controller function to create a new course and reference a class by ID
    createCourse = async (req, res, next) => {
        try {
            const courseData = req.body;
            const classID = courseData.classID;

            // Ensure the class with the provided classID exists
            const classExists = await this.class.getClassById(classID);

            if (!classExists) {
                throw new CustomError('Class with the provided class ID not found.', 404);
            }

            // Create the course and reference the classID
            const createdCourse = await this.course.createCourse(courseData, classID);

            // Construct the response
            const response = {
                course: {
                    courseID: createdCourse.courseID, // Adjusted  this to match your actual property name
                    description: createdCourse.description,
                    course_name: createdCourse.course_name,
                    subject_name: createdCourse.subject_name,
                },
                class: {
                    classID: classExists.classID,
                    class_name: classExists.class_name,
                    description: classExists.description,
                },
            };

            res.status(201).json(response);
        } catch (error) {
            console.error('Error in creating course:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
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
            res.status(200).json({ course: courseData, });
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
}

module.exports = CourseController;


