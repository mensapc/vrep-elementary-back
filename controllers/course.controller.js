const Course = require("../models/course");
const Student = require('../models/student');
const CustomError = require("../utils/CustomError");

class CourseController {
  createCourse = async (req, res, next) => {
    try {
      const { course_name } = req.body;
      const course = await Course.create({ course_name });
      res.status(201).json(course);
    } catch (error) {
      console.error(`Error creating course and referencing class: ${error}`);
      next(error);
    }
  };

  addTeacherToCourse = async (req, res, next) => {
    try {
      const { course, staff } = req.body;

      const staffExists = await Course.find({ staff: staff });
      if (staffExists.length)
        throw new CustomError("this teacher already exists in course", 400);
      const newCourse = await Course.findByIdAndUpdate(
        course,
        { $push: { staff: staff } },
        { new: true }
      );
      if (!newCourse) throw new CustomError("course not found", 404);
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
      if (!newCourse) throw new CustomError("course not found", 404);
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
        throw new CustomError("No Course found .", 404);
      }
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error getting courses:", error);
      next(error);
    }
  };

  // Get courses by search
  getCoursesBySearch = async (req, res, next) => {
    const data = req.query;
    try {
      const courses = await Course.find(data).populate([
        { path: "_class", select: "name" },
        { path: "staff", select: "first_name last_name" },
      ]);
      if (!courses) {
        throw new CustomError("No Course found .", 404);
      }
      res.status(200).json(courses);
    } catch (error) {
      console.error("Error getting courses:", error);
      next(error);
    }
  };

  // Get Single Course
  getCourse = async (req, res, next) => {
    const { id } = req.params;

    try {
      const course = await Course.findById(id);
      if (!course) {
        throw new CustomError("Course not found", 404);
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
        throw new CustomError("Course not found", 404);
      }
      res.status(204).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error(
        `Error deleting course with ID ${req.params.courseID}: ${error}`
      );
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

  // Get courses added by a staff/teacher
  getCoursesByStaff = async (req, res, next) => {
    const { staffId } = req.params;

    try {
      const courses = await Course.find({ staff: staffId }).populate([
        { path: "_class", select: "name" },
        { path: "staff", select: "first_name last_name" },
      ]);
      if (!courses) {
        throw new CustomError("Courses not available", 404);
      }
      res.status(200).json({ courses });
    } catch (error) {
      console.error(`Error staffId number ${id}: ${error}`);
      next(error);
    }
  };

  StudentInaCourses = async (req, res, next) => {
    const { reg_number } = req.params;

    try {
        // Find courses where the student's reg_number matches
        const courses = await Course.aggregate([
            {
                $unwind: "$student" // Unwind the student array
            },
            {
                $lookup: {
                    from: "students", // Assuming the collection name is "students"
                    localField: "student",
                    foreignField: "_id",
                    as: "student_details"
                }
            },
            {
                $match: {
                    "student_details.reg_number": reg_number // Match the reg_number
                }
            },
            {
                $project: {
                    _id: 1,
                    course_name: 1,
                    updated_at: 1,
                    created_at: 1,
                    student: "$student_details.first_name" // Extract first_name from student_details
                }
            }
        ])

        if (!courses || courses.length === 0) {
            throw new CustomError("Student is not enrolled in a course", 404);
        }

        res.status(200).json({ courses });
    } catch (error) {
        console.error(`Error student id number ${reg_number}: ${error}`);
        next(error);
    }
};
getAllStudentInAcourse = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Find the course by _id
    const course = await Course.findOne({ _id: id }).populate('student', 'first_name')

    if (!course) {
      throw new CustomError("Course not found", 404);
    }

    res.status(200).json({ 
      course_name: course.course_name,
      students: course.student.map(student => student.first_name),
      numberOfSudents: course.student.map(student => student).length,
    });
  } catch (error) {
    console.error(`Error finding student in course ${id}: ${error}`);
    next(error);
  }
};

  addStudentToCourse = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reg_number} = req.body;

      // Check if the student exists
      const isStudent = await Student.findOne({ reg_number });
      if (!isStudent) {
        throw new CustomError("Student not found", 404);
      }

      // Check if the student is already enrolled in the course
      const course = await Course.findById(id);

      
      if (!course) {
        throw new CustomError("Course not found", 404);
      }

      // Add the student to the course
      const newCourse = await Course.findByIdAndUpdate(
        course,
        { $push: { student: isStudent._id} },
        { new: true }
      ).populate('student');
      
      await newCourse.save();

      res.status(200).json(newCourse);
    } catch (error) {
      console.error(`Error adding student to course: ${error}`);
      next(error);
    }
  }
}

module.exports = CourseController;
