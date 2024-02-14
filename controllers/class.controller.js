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
}

module.exports = ClassController;

