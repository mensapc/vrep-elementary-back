const mongoose = require('mongoose');
const Exam = require('../models/exam');
const Question = require('../models/question');
const CustomError = require('../utils/CustomError');

class QuestionController {
  createQuestion = async (req, res, next) => {
    const questionData = req.body;
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();
      const exam = await Exam.findById(questionData.exam_id).session(session);
      if (!exam) throw new CustomError('Exam id  you provided not found', 404);

      const newQuestion = await Question.create({ ...questionData, exam: exam._id });
      exam.questions.push(newQuestion._id);
      await exam.save({ session });
      await session.commitTransaction();
      return res.status(200).json(newQuestion);
    } catch (error) {
      await session.abortTransaction();
      console.error(`Error creating question: ${error}`);
      next(error);
    } finally {
      session.endSession();
    }
  };

  getQuestions = async (req, res, next) => {
    try {
      const questions = await Question.find();
      res.status(200).json(questions);
    } catch (error) {
      console.error(`Error getting question: ${error}`);
      next(error);
    }
  };

  getQuestion = async (req, res, next) => {
    const { id } = req.params;
    try {
      const question = await Question.findById(id);
      res.status(200).json(question);
    } catch (error) {
      console.error(`Error getting question: ${error}`);
      next(error);
    }
  };

  getQuestionWithOptions = async (req, res, next) => {
    const { id } = req.params;
    try {
      const questions = await Question.findById(id).populate('options');
      res.status(200).json(questions);
    } catch (error) {
      console.error(`Error getting questions: ${error}`);
      next(error);
    }
  };

  updateQuestion = async (req, res, next) => {
    const { id } = req.params;
    const questionData = req.body;
    delete questionData._id;
    delete questionData.exam;

    try {
      const updatedQuestion = await Question.findByIdAndUpdate(id, questionData, { new: true });
      if (!updatedQuestion) throw new CustomError('Question id you provided not found', 404);
      return res.status(200).json(updatedQuestion);
    } catch (error) {
      console.error(`Error updating question: ${error}`);
      next(error);
    }
  };

  deleteQuestion = async (req, res, next) => {
    const { id } = req.params;
    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const questionToDelete = await Question.findById(id).populate('options').session(session);
      if (!questionToDelete) throw new CustomError('Question not found', 404);

      await Question.deleteMany({ _id: { $in: questionToDelete.options } }, { session });
      await questionToDelete.deleteOne({ session });
      await session.commitTransaction();
      return res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
      await session.abortTransaction();
      console.error(`Error deleting question: ${error}`);
      next(error);
    } finally {
      session.endSession();
    }
  };
}

module.exports = QuestionController;
