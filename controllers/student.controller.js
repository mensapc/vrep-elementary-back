const Student = require('../models/student');
const CustomError = require('../utils/CustomError.js');
const RegistrationUtils = require('../utils/utils.addStudent');
const generateRegNumber = require('../utils/utils.registration_number');
const generateToken = require('../utils/utils.token')

class StudentAuthController {
    constructor() {
        this.student = new Student();
        this.registrationUtils = new RegistrationUtils();
    }
    // Registering Student controller
    addStudent = async (req, res, next) => {
        const userType = req.params.userType;
        const userData = req.body;

        let newUser;
        let regNumber;

        try {

            this.registrationUtils.validateStudentInfo(userData, userType,);
            const { email, role, } = await this.registrationUtils.prepareData(userData);
            switch (userType) {
                case 'student':
                    regNumber = generateRegNumber();
                    newUser = await this.student.AddSingleStudent({
                        ...userData,
                        email,
                        reg_number: regNumber,
                        role,
                    });

                    break;

                default:
                    throw new CustomError(`Route: register/${userType} not found`, 404);


            }
            const token = generateToken(newUser);
            res.status(201).json({ student: newUser, token });
        } catch (error) {
            console.error(`Error registering ${userType}: ${error}`);
            next(error);
        }
    };

    // Get Single student controller
    getSingleStudent = async (req, res, next) => {
        const userType = req.params.userType;
        const userData = req.body;

        try {
            const { reg_number } = userData;

            if (!reg_number) {
                throw new CustomError('Registration number is required', 400);
            }

            let studentData;

            switch (userType) {
                case 'regnum':
                    studentData = await this.student.findStudentByRegNumber(reg_number);

                    if (!studentData) {
                        throw new CustomError(`Student with registration number ${reg_number} not found`, 404);
                    }
                    break;

                default:
                    throw new Error(`Invalid userType: ${userType}`, 400);
            }
            res.status(200).json({ student: studentData, });
        } catch (error) {
            console.error(`Error retrieving student with registration number ${userData.reg_number}: ${error}`);
            next(error);
        }
    };

    // Get All students controller
    getAllStudents = async (req, res, next) => {
        try {
            const students = await this.student.findAllStudents();

            if (students.length === 0) {
                return res.status(404).json({ message: 'No students found .' })
            }
            res.status(200).json({ Allstudents: students })
        } catch (error) {
            console.error(`Error retrieving all students `, error);
            next(error);
        }
    };
    // Delete student controller
    deleteStudent = async (req, res, next) => {
        try {
            const { reg_number } = req.body;

            if (!reg_number) {
                throw new CustomError(`Route: not able to get /${reg_number}`, 400);
            }

            const deletedStudent = await this.student.deleteStudentByRegNumber(reg_number);

            if (!deletedStudent) {
                res.status(204).json({ message: `Student with registration number /${reg_number} deleted` });
            }
        } catch (error) {
            console.error(`Error deleting student with registration number ${req.body.reg_number}: ${error}`);
            next(error);
        }
    };


    // An Update Student controller
    updateStudent = async (req, res, next) => {
        try {
            const { reg_number } = req.body;
            const updatedData = req.body; // Assuming you send the entire updated data in the request body

            if (!reg_number) {
                throw new CustomError('Registration number is required', 400);
            }

            const updatedStudent = await this.student.updateStudentByRegNumber(reg_number, updatedData);

            res.status(201).json({ student: updatedStudent });
        } catch (error) {
            console.error(`Error updating student with registration number ${req.body.reg_number}: ${error}`);
            next(error);
        }
    };
}


module.exports = StudentAuthController;
