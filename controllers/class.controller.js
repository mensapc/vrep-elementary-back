const Class = require('../models/class');

class ClassController {
  createClass = async (req, res, next) => {
    const classData = req.body;
    try {
      const newClass = await Class.create(classData);
      res.status(200).json(newClass);
    } catch (error) {
      console.error(`Error creating class: ${error}`);
      next(error);
    }
  };
}

module.exports = ClassController;

