const Student = require('../models/student');
const CustomError = require('../utils/CustomError.js');
const RegistrationUtils = require('../utils/utils.registration');
const generateToken = require('../utils/utils.token');
const generateRegNumber = require('../utils/utils.registration_number');

class StudentController {
	constructor() {
		this.registrationUtils = new RegistrationUtils();
	}

	// Registering Student controller
	register = async (req, res, next) => {
		const userData = req.body;
		try {
			this.registrationUtils.validateData(userData, 'pupil');
			const regNumber = await this.generateUniqueRegNumber();
			const newStudent = await Student.create({ ...userData, reg_number: regNumber });
			const token = generateToken({
				id: newStudent.id,
				email: newStudent.email,
				role: newStudent.role,
			});
			res.status(201).json({ ...newStudent._doc, token });
		} catch (error) {
			console.error(`Error registering Student: ${error}`);
			next(error);
		}
	};

	// Login Student controller
	login = async (req, res, next) => {
		const { reg_number } = req.body;

		try {
			let student = await Student.findOne({ reg_number });
			if (!student) throw new CustomError('Student not found', 404);
			delete student._doc.password;

			const token = generateToken({
				id: student.id,
				email: student.email,
				role: student.role,
			});
			res.status(200).json({ ...student._doc, token });
		} catch (error) {
			console.error('Error logging in student:', error);
			next(error);
		}
	};

	// Get student by id
	getById = async (req, res, next) => {
		const { id } = req.params;
		try {
			const student = await Student.findOne({ _id: id });
			if (!student) throw new CustomError('Student not found', 404);
			res.status(200).json(student);
		} catch (error) {
			console.error('Fail to retrieve student:', error);
			next(error);
		}
	};

	// Get student by search
	getBySearch = async (req, res, next) => {
		const query = req.query;

		try {
			let student = await Student.findOne(query);
			if (!student) throw new CustomError('Student not found', 404);
			res.status(200).json(student);
		} catch (error) {
			console.error('Fail to retrieve student:', error);
			next(error);
		}
	};

	// Get All students controller
	getAll = async (req, res, next) => {
		try {
			const students = await Student.find();
			res.status(200).json(students);
		} catch (error) {
			console.error(`Error retrieving all students `, error);
			next(error);
		}
	};

	// Delete student
	deleteStudent = async (req, res, next) => {
		const { id } = req.params;
		try {
			await Student.findByIdAndDelete({ _id: id });
			res.status(204).json({ message: 'Student deleted successfully' });
		} catch (error) {
			console.error(`Error deleting student: ${error}`);
			next(error);
		}
	};

	// An Update Student controller
	updateStudent = async (req, res, next) => {
		try {
			const data = req.body;
			delete data.reg_number;

			const updatedStudent = await Student.findByIdAndUpdate(req.params.id, data, { new: true });
			res.status(201).json({ ...updatedStudent._doc });
		} catch (error) {
			console.error(`Error updating student: ${error}`);
			next(error);
		}
	};

	// Generate Unique Registration Number
	generateUniqueRegNumber = () => {
		const regNumber = generateRegNumber();
		return this.checkStudentRegNumber(regNumber);
	};

	// Check if Registration Number is Unique
	checkStudentRegNumber = async (reg_number) => {
		try {
			const student = await Student.findOne({ reg_number });
			if (student) return this.generateUniqueRegNumber();
			return reg_number;
		} catch (error) {
			throw new Error('Failed to find student by reg number.');
		}
	};
}

module.exports = StudentController;

