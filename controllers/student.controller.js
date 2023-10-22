const { Query } = require("firefose");
const Student = require("../models/student");
const CustomError = require("../utils/CustomError.js");
const RegistrationUtils = require("../utils/utils.registration");
const generateToken = require("../utils/utils.token");
const generateRegNumber = require("../utils/utils.registration_number");
const admin = require("firebase-admin");

class StudentController {
  constructor() {
    this.registrationUtils = new RegistrationUtils();
  }

  // Registering Student controller
  register = async (req, res, next) => {
    const userData = req.body;
    try {
      this.registrationUtils.validateData(userData, "student");
      const { email, role } = await this.registrationUtils.sanitizeData(userData);
      const regNumber = await this.generateUniqueRegNumber();
      const newStudent = await Student.create({ ...userData, reg_number: regNumber, email, role });
      const token = generateToken({ email, role });
      res.status(201).json({ student: newStudent, token });
    } catch (error) {
      console.error(`Error registering Student: ${error}`);
      next(error);
    }
  };

  // Login Student controller
  login = async (req, res, next) => {
    const { reg_number } = req.body;

    try {
      const query = new Query().where("reg_number", "==", reg_number);
      let student = await Student.find(query);
      student = student[0];
      if (!student) throw new CustomError("Student not found", 404);
      const token = generateToken({ email: student.email, role: student.role });
      res.status(200).json({ student, token });
    } catch (error) {
      console.error("Error logging in student:", error);
      next(error);
    }
  };

  // Get student by id
  getById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const student = await Student.findById(id);
      if (!student) throw new CustomError("Student not found", 404);
      res.status(200).json({ student });
    } catch (error) {
      console.error("Fail to retrieve student:", error);
      next(error);
    }
  };

  // Get student by reg number
  getBySearch = async (req, res, next) => {
    const [key, value] = Object.entries(req.query)[0];

    try {
      const query = new Query().where(key, "==", value);
      let students = await Student.find(query);
      res.status(200).json({ students });
    } catch (error) {
      console.error("Fail to retrieve student:", error);
      next(error);
    }
  };

  // Get All students controller
  getAll = async (req, res, next) => {
    try {
      const query = new Query();
      const students = await Student.find(query);
      res.status(200).json({ students });
    } catch (error) {
      console.error(`Error retrieving all students `, error);
      next(error);
    }
  };
  // Delete student
  deleteStudent = async (req, res, next) => {
    const { id } = req.params;
    try {
      await Student.deleteById(id);
      res.status(200).json({ message: "Student deleted successfully" });
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

      const updatedStudent = await Student.updateById(req.params.id, data);
      res.status(201).json({ student: updatedStudent });
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
      const query = new Query().where("reg_number", "==", reg_number);
      const student = await Student.find(query);
      if (student.length > 0) return this.generateUniqueRegNumber();
      return reg_number;
    } catch (error) {
      throw new Error("Failed to find student by reg number.");
    }
  };
}

module.exports = StudentController;
