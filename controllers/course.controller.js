const Course = require('../models/course'); // Import the Course model
const Class = require('../models/class')
const Staff = require('../models/staff')
const CustomError = require('../utils/CustomError');

class CourseController {
    constructor() {
        this.course = new Course();
        this.staff = new Staff()
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

    createCourseSchemData = async (req, res, next) => {
        try {
            const classSchemeData = req.body; // Class data from request body

            const staffID = classSchemeData.staff_id; // Get staff_id from class data scheme

            // Ensure staff with provided staff_id exists
            const staffExists = await this.staff.getStaffById(staffID);
            if (!staffExists) {
                throw new CustomError('Staff with the provided staff_id not found.', 404);
            }

            // Create the class scheme and reference the staff_id
            const createdScheme = await this.course.createCourseSchem(classSchemeData, staffID);


            // A validation check to ensure required entities 
            if (!createdScheme) {
                throw new CustomError('Course Scheme details and staff_id not found.', 404)
            }

            // date format to get the "created_At" key in the "CourseSchema" object
            const currentDate = new Date();
            const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
                .toString().padStart(2, '0')}-${currentDate.getDate().toString()
                    .padStart(2, '0')} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate
                        .getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString()
                            .padStart(2, '0')}`;

            const response = {
                CourseSchema: {
                    name: createdScheme.name,
                    term_limit: createdScheme.term_limit,
                    created_At: formattedDate,
                    end_of_term: createdScheme.end_of_term,
                    courseSchemID: createdScheme.courseSchemID
                },

                staff: {
                    staff_id: staffExists.staff_id,
                    last_name: staffExists.last_name,
                    first_name: staffExists.first_name,
                    age: staffExists.age,
                    email: staffExists.email
                }
            };
            res.status(201).json(response);
        } catch (error) {
            console.error(`Error creating coure schem and referencing staff: ${error}`);
            next(error);
        }
    };
}

module.exports = CourseController;


