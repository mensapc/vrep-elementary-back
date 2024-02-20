const mongoose = require('mongoose');
const Class = require('../models/class');
const CustomError = require('../utils/CustomError');
const {
  checkIfCourseAlreadyAdded,
  addStaffToCourse,
  classWithPopulatedData,
} = require('../utils/utils.class');

class ClassController {
  createClass = async (req, res, next) => {
    const classData = req.body;
    try {
      const ClassExist = await Class.findOne({ name: classData.name });
      if (ClassExist) throw new CustomError('Class with the same name already exist', 400);

      const newClass = await Class.create(classData);
      res.status(200).json(newClass);
    } catch (error) {
      console.error(`Error creating class: ${error}`);
      next(error);
    }
  };

  getClasses = async (req, res, next) => {
    try {
      const classes = await Class.find();
      res.status(200).json(classes);
    } catch (error) {
      console.error(`Error getting classes: ${error}`);
      next(error);
    }
  };

  getClassById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const _class = await classWithPopulatedData(id);
      if (!_class) throw new CustomError('Class not found', 404);
      res.status(200).json(_class);
    } catch (error) {
      console.error(`Error getting class by id: ${error}`);
      next(error);
    }
  };

  getClassByTeacherId = async (req, res, next) => {
    const { id } = req.params;
    try {
      const _class = await Class.find({ staff: id });
      if (!_class) throw new CustomError('Class not found', 404);
      res.status(200).json(_class);
    } catch (error) {
      console.error(`Error getting class by staff id: ${error}`);
      next(error);
    }
  };

  updateClass = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, staff } = req.body;
    try {
      const _class = await Class.findByIdAndUpdate(id, { name, description, staff }, { new: true });
      if (!_class) throw new CustomError('Class not found', 404);
      res.status(200).json(_class);
    } catch (error) {
      console.error(`Error updating class: ${error}`);
      next(error);
    }
  };

  deleteClass = async (req, res, next) => {
    const { id } = req.params;
    try {
      const _class = await Class.findByIdAndDelete(id);
      if (!_class) throw new CustomError('Class not found', 404);
      res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
      console.error(`Error deleting class: ${error}`);
      next(error);
    }
  };

  addCourseToClass = async (req, res, next) => {
    const { _class, course, staff } = req.body;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await checkIfCourseAlreadyAdded(_class, course, session);
        await addStaffToCourse(course, staff, session);
        const newClass = await Class.findByIdAndUpdate(
          _class,
          { $push: { courses: { course, staff } } },
          { new: true }
        ).session(session);
        if (!newClass) {
          throw new CustomError('Fail to add course in class', 400);
        }
        res.status(200).json(newClass);
      });
    } catch (error) {
      console.error(`Error adding course to class: ${error}`);
      next(error);
    } finally {
      session.endSession();
    }
  };

  removeCourseFromClass = async (req, res, next) => {
    const { _class, course } = req.body;
    try {
      const newClass = await Class.findByIdAndUpdate(
        _class,
        { $pull: { courses: { course } } },
        { new: true }
      );
      if (!newClass) {
        throw new CustomError('Fail to remove course from class', 400);
      }
      res.status(200).json(newClass);
    } catch (error) {
      console.error(`Error removing course from class: ${error}`);
      next(error);
    }
  };
}

module.exports = ClassController;

