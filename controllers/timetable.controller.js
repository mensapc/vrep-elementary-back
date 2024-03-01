const mongoose = require('mongoose');
const Timetable = require('../models/timetable');
const CustomError = require('../utils/CustomError');
const { generateTimetable, formatTimetableData } = require('../utils/utils.timetable');

class TimetableController {
  createTimetable = async (req, res, next) => {
    const { staff } = req.body;
    try {
      const timetable = await Timetable.find({ staff: staff });
      if (timetable.length) throw new CustomError('Time Table arleady exist', 400);
      const newTimetable = await generateTimetable(staff);
      res.status(200).json(newTimetable);
    } catch (error) {
      console.error(`Error creating timetable: ${error.message}`);
      next(error);
    }
  };

  getTimetableByStaff = async (req, res, next) => {
    const { id } = req.params;
    try {
      const timetable = await Timetable.aggregate([
        { $match: { staff: new mongoose.Types.ObjectId(id) } },
        { $sort: { day: 1, start_time: 1 } },
        {
          $group: {
            _id: { start_time: '$start_time' },
            entries: { $push: '$$ROOT' },
          },
        },
      ]);

      if (!timetable) throw new CustomError('Timetable not found', 404);

      const formattedTimetable = formatTimetableData(timetable);
      res.status(200).json(formattedTimetable);
    } catch (error) {
      console.error(`Error getting timetable: ${error.message}`);
      next(error);
    }
  };

  updateTimetable = async (req, res, next) => {
    const { id, course } = req.body;
    try {
      const timetable = await Timetable.findOneAndUpdate(
        {
          _id: id,
        },
        { course },
        { new: true }
      );
      if (!timetable) throw new CustomError('Timetable not found', 404);
      res.status(200).json(timetable);
    } catch (error) {
      console.error(`Error updating timetable: ${error.message}`);
      next(error);
    }
  };

  removeTimetable = async (req, res, next) => {
    const { id } = req.body;
    try {
      const timetable = await Timetable.findOneAndUpdate(
        { _id: id },
        { course: '' },
        { new: true }
      );
      if (!timetable) throw new CustomError('Timetable not found', 404);
      res.status(200).json(timetable);
    } catch (error) {
      console.error(`Error deleting timetable: ${error.message}`);
      next(error);
    }
  };
}

module.exports = TimetableController;
