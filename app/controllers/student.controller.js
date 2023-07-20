const Student = require('../models/student');

class StudentController {
    constructor() {
        this.student = new Student();
    }

    // Method to create a new student
    createStudent = async(req, res, next) => {
        try {
            // Create student
            const data = req.body;
            const result = await this.student.createStudent(data);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating student:', error);
            next(error);
        }
    }
}

module.exports = StudentController;