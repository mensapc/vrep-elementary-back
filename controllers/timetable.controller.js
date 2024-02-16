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

  getAllTimetables = async (req, res, next) => {
    try {
      const timetables = await Timetable.find();
      res.status(200).json(timetables);
    } catch (error) {
      console.error(`Error retrieving all timetables `, error);
      next(error);
    }
  };

  getTimeTableBySearch = async (req, res, next) => {
    const query = req.query;
    try {
      const timetables = await Timetable.find(query);
      res.status(200).json(timetables);
    } catch (error) {
      console.error(`Error retrieving timetable by search`, error);
      next(error);
    }
  };

  updateTimetable = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const timetable = await Timetable.findOneAndUpdate(
        {
          _id: id,
        },
        data,
        { new: true }
      );
      if (!timetable) throw new CustomError('Timetable not found', 404);
      res.status(200).json(timetable);
    } catch (error) {
      console.error(`Error updating timetable: ${error.message}`);
      next(error);
    }
  };
}

module.exports = TimetableController;
