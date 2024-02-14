const Class = require('../models/class');
const CustomError = require('../utils/CustomError');

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
      const _class = await Class.findById(id);
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
    const { name, description } = req.body;
    try {
      const _class = await Class.findByIdAndUpdate(id, { name, description }, { new: true });
      if (!_class) throw new CustomError('Class not found', 404);
      res.status(200).json(_class);
    } catch (error) {
      console.error(`Error updating class: ${error}`);
      next(error);
    }
  };
}

module.exports = ClassController;

