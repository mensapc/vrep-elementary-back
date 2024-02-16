const Timetable = require('../models/timetable');

class TimetableController {
  createTimetable = async (req, res, next) => {
    const data = req.body;
    try {
      const newTimetable = await Timetable.create(data);
      res.status(201).send(newTimetable);
    } catch (error) {
      console.error(`Error in creating Timetable: ${error.message}`);
      next(error);
    }
  };
}

module.exports = TimetableController;
