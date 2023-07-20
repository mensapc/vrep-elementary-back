const User = require('../models/user');
const Student = require('../models/student');
const CustomError = require('../../utils/CustomError');

class StudentController {
    constructor() {
        this.user = new User();
        this.student = new Student();
    }

    // Method to create a new student
    createStudent = async(req, res, next) => {
        const data = req.body;
        try {

            // Validate if user exists
            const isUserExist = await this.user.findUserById(data.user_id);
            if (!isUserExist) throw new CustomError('User is not exist', 401);

            // Create student
            const result = await this.student.createStudent(data);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating student:', error);
            next(error);
        }
    }

    // Method to get all students
    getAllStudents = async(req, res, next) => {
        try {
            const result = await this.student.getAllStudents();
            res.status(200).json({ students: result });
        } catch (error) {
            console.error('Error getting all students:', error);
            next(error);
        }
    }
}

module.exports = StudentController;