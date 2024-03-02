const mongoose = require('mongoose');
const Student = require('../models/student');
const Class = require('../models/class.js');
const CustomError = require('../utils/CustomError.js');
const RegistrationUtils = require('../utils/utils.registration');
const generateToken = require('../utils/utils.token');
const {
  generateUniqueRegNumber,
  perfomStudentDeletion,
} = require('../utils/utils.student.js');
const { uploadImage } = require('../services/cloudinary.js');
const { sortActions } = require('../utils/utils.common.js');
const { createActivity } = require('./activity.controller.js');

class StudentController {
  constructor() {
    this.registrationUtils = new RegistrationUtils();
  }

  // Registering Student controller
  register = async (req, res, next) => {
    const userData = req.body;
    try {
      this.registrationUtils.validateData(userData, 'pupil');
      const regNumber = await generateUniqueRegNumber();

      const _class = await Class.findOne({ _id: userData._class });
      if (!_class)
        throw new CustomError('Class with provided id not found', 404);

      if (req.file?.path) {
        const url = await uploadImage(req.file.path);
        userData.photo = url;
      }

      const newStudent = await Student.create({
        ...userData,
        reg_number: regNumber,
      });
      _class.students.push(newStudent._id);
      await _class.save();
      const token = generateToken({
        id: newStudent.id,
        email: newStudent.email,
        first_name: newStudent.first_name,
        last_name: newStudent.last_name,
        role: newStudent.role,
      });

      await createActivity(
        `New student ${newStudent.first_name} ${newStudent.last_name} registered by ${req.user.first_name} ${req.user.last_name}`
      );
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
        first_name: student.first_name,
        last_name: student.last_name,
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
      const student = await Student.findOne({ _id: id }).populate({
        path: '_class',
        select: 'name',
      });
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
      let student = await Student.find(query).populate({
        path: '_class',
        select: 'name',
      });
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
      const students = await Student.find().populate({
        path: '_class',
        select: '-students -courses',
        populate: {
          path: 'staff',
          select: '_id first_name last_name email role ',
        },
      });
      res.status(200).json(students);
    } catch (error) {
      console.error(`Error retrieving all students `, error);
      next(error);
    }
  };

  // Delete student
  deleteStudent = async (req, res, next) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const deletedUser = await perfomStudentDeletion(id, session);
      await createActivity(
        `Student ${deletedUser.first_name} ${deletedUser.last_name} deleted by ${req.user.first_name} ${req.user.last_name}`
      );
      res.status(200).json({ message: 'Student deleted successfully' });
      await session.commitTransaction();
    } catch (error) {
      console.error(`Error deleting student: ${error}`);
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  };

  // An Update Student controller
  updateStudent = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    delete data.reg_number;
    delete data._id;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      if (req.file?.path) {
        const url = await uploadImage(req.file.path);
        data.photo = url;
      }

      if (data._class) {
        await this.updateStudentClass(id, data, session, res);
      } else {
        const info = await Student.findByIdAndUpdate(id, data, {
          new: true,
        }).session(session);
        await createActivity(
          `Student ${info.first_name} ${info.last_name} updated by ${req.user.first_name} ${req.user.last_name}`
        );
        res.status(201).json(info);
      }
      await session.commitTransaction();
    } catch (error) {
      console.error(`Error updating student: ${error}`);
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  };

  updateStudentClass = async (id, data, session, res) => {
    const student = await Student.findById(id).session(session);
    const _class = await Class.findOne({ _id: data._class }).session(session);
    if (!_class) throw new CustomError('Class with provided id not found', 404);

    await Class.updateOne(
      { _id: student._class },
      { $pull: { students: id } }
    ).session(session);
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: { _class, ...data } },
      { new: true }
    ).session(session);
    await Class.updateOne(
      { _id: _class },
      { $addToSet: { students: id } }
    ).session(session);
    res.status(200).json(updatedStudent);
  };

  studentsBySort = async (req, res, next) => {
    const { sortby } = req.query;
    const sortAction = sortActions(sortby);

    try {
      const students = await Student.find()
        .populate({
          path: '_class',
          select: '-students -courses',
          populate: { path: 'staff', select: '_id first_name last_name email' },
        })
        .sort(sortAction);
      res.status(200).json(students);
    } catch (error) {
      console.error(`Error retrieving sorted students `, error);
      next(error);
    }
  };
  sortedStudentsInClass = async (req, res, next) => {
    const { sortby, _class } = req.query;
    const sortAction = sortActions(sortby);

    try {
      const students = await Student.find({ _class })
        .populate({
          path: '_class',
          select: '-students -courses',
        })
        .sort(sortAction);
      res.status(200).json(students);
    } catch (error) {
      console.error(`Error retrieving sorted students `, error);
      next(error);
    }
  };

  deleteMultipleStudents = async (req, res, next) => {
    const { data } = req.body;
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      for (const id of data) {
        await perfomStudentDeletion(id, session);
      }
      await createActivity(
        `Multiple students deleted by ${req.user.first_name} ${req.user.last_name}`
      );
      res.status(200).json({ message: 'Students deleted successfully' });
      await session.commitTransaction();
    } catch (error) {
      console.error(`Error deleting multiple students: ${error}`);
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  };
}

module.exports = StudentController;
