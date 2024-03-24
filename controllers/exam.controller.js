const mongoose = require('mongoose');
const Exam = require('../models/exam');
const Option = require('../models/option');
const Question = require('../models/question');
const {
  checkExamAvailability,
  examDuration,
  validateExamDuration,
  getTimeRangePupilTookExam
} = require('../utils/utils.exam');
const CustomError = require('../utils/CustomError');
const { sortActions } = require('../utils/utils.common');
const { createActivity } = require('./activity.controller');

class ExamController {
  createExam = async (req, res, next) => {
    const examData = req.body;

    try {
      // validate exam duration
      const durationValidate = validateExamDuration(examData);
      if (!durationValidate.is_valid) throw new CustomError(durationValidate.message, 400);

      // calculate exam duration
      const duration = examDuration(examData);
      if (!duration.is_valid) throw new CustomError(duration.message, 400);
      examData.time_limit = duration.duration;

      const newExam = await Exam.create(examData);
      await createActivity(
        `New exam ${newExam.name} created by ${req.user.first_name} ${req.user.last_name}`
      );
      res.status(200).json(newExam);
    } catch (error) {
      console.error(`Error creating exam: ${error}`);
      next(error);
    }
  };

  getExams = async (req, res, next) => {
    try {
      const exams = await Exam.find();
      res.status(200).json(exams);
    } catch (error) {
      console.error(`Error getting exams: ${error}`);
      next(error);
    }
  };

  getExam = async (req, res, next) => {
    const { id } = req.params;
    try {
      const exam = await Exam.findById(id);
      res.status(200).json(exam);
    } catch (error) {
      console.error(`Error getting exam: ${error}`);
      next(error);
    }
  };

  getExamWithQustionsAndOptions = async (req, res, next) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const exam = await Exam.findOne({ _id: id })
        .populate({ path: 'questions', populate: { path: 'options' } })
        .session(session);
  
      if (req.user.role === 'pupil') {
        // check if exam is available
        const examAvailability = checkExamAvailability(exam);
        if (!examAvailability.is_available) throw new CustomError(examAvailability.message, 403);
        
        // Calculate the time range the pupil took the exam
        const timeRange = getTimeRangePupilTookExam(exam);
        // Add time range to the exam object
        exam.timeRange = timeRange;
      }
  
      await session.commitTransaction();
  
      return res.status(200).json(exam);
    } catch (error) {
      await session.abortTransaction();
      console.error(`Error getting exam: ${error}`);
      next(error);
    } finally {
      session.endSession();
    }
  };

  updateExam = async (req, res, next) => {
    const { id } = req.params;
    const examData = req.body;
    delete examData._id;
    delete examData.questions;

    try {
      if (examData.time_limit) {
        throw new CustomError('Exam duration can be updated via start date and end date', 400);
      }

      if (examData.start_date || examData.end_date) {
        // validate exam duration
        const durationValidate = validateExamDuration(examData);
        if (!durationValidate.is_valid) throw new CustomError(durationValidate.message, 400);

        // calculate exam duration
        const duration = examDuration(examData);
        if (!duration.is_valid) throw new CustomError(duration.message, 400);
        examData.time_limit = duration.duration;
      }

      const updatedExam = await Exam.findByIdAndUpdate(id, examData, { new: true });

      createActivity(
        `Exam ${updatedExam.name} updated by ${req.user.first_name} ${req.user.last_name}`
      );
      res.status(200).json(updatedExam);
    } catch (error) {
      console.error(`Error updating exam: ${error}`);
      next(error);
    }
  };

  deleteExam = async (req, res, next) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const examToDelete = await Exam.findById(id)
        .populate({ path: 'questions', populate: { path: 'options' } })
        .session(session);

      if (!examToDelete) throw new CustomError('Exam not found', 404);

      for (const question of examToDelete.questions) {
        await Option.deleteMany({ _id: { $in: question.options } }, { session });
      }

      await Question.deleteMany({ _id: { $in: examToDelete.questions } }, { session });
      await examToDelete.deleteOne({ session });
      await session.commitTransaction();

      createActivity(
        `Exam ${examToDelete.name} deleted by ${req.user.first_name} ${req.user.last_name}`
      );
      return res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
      await session.abortTransaction();
      console.error(`Error deleting exam: ${error}`);
      next(error);
    } finally {
      session.endSession();
    }
  };

  sortExams = async (req, res, next) => {
    const { sortby } = req.query;
    const sortAction = sortActions(sortby);
    try {
      const exams = await Exam.find().sort(sortAction);
      res.status(200).json(exams).populate({
        path: '_class',
      });
    } catch (error) {
      console.error(`Error getting exams: ${error}`);
      next(error);
    }
  };

  getTeachersExams = async (req, res, next) => {
    const { id } = req.params;
    try {
      const exams = await Exam.find({ staff: id });
      res.status(200).json(exams);
    } catch (error) {
      console.error(`Error getting exams: ${error}`);
      next(error);
    }
  };
}

module.exports = ExamController;
