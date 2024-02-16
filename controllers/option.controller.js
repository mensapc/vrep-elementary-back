const mongoose = require('mongoose');
const Option = require('../models/option');
const Question = require('../models/question');
const CustomError = require('../utils/CustomError');

class OptionController {
  createOption = async (req, res, next) => {
    const optionData = req.body;
    const session = await mongoose.startSession();

    try {
      await session.startTransaction();
      const question = await Question.findById(optionData.question_id).session(session);
      if (!question) throw new CustomError('Question id you provided not found', 404);

      const newOption = await Option.create({ ...optionData, question: question._id });
      question.options.push(newOption._id);

      await question.save({ session });
      await session.commitTransaction();
      return res.status(200).json(newOption);
    } catch (error) {
      await session.abortTransaction();
      console.error(`Error creating option: ${error}`);
      next(error);
    } finally {
      session.endSession();
    }
  };

  getOption = async (req, res, next) => {
    const { id } = req.params;
    try {
      const option = await Option.findById(id);
      res.status(200).json(option);
    } catch (error) {
      console.error(`Error getting option: ${error}`);
      next(error);
    }
  };

  updateOption = async (req, res, next) => {
    const { id } = req.params;
    const optionData = req.body;
    delete optionData._id;
    delete optionData.question;

    try {
      const updatedOption = await Option.findByIdAndUpdate(id, optionData, { new: true });
      res.status(200).json(updatedOption);
    } catch (error) {
      console.error(`Error updating option: ${error}`);
      next(error);
    }
  };

  deleteOption = async (req, res, next) => {
    const { id } = req.params;
    try {
      const optionToDelete = await Option.findByIdAndDelete({ _id: id });
      if (!optionToDelete) throw new CustomError('Option id you provided not found', 404);
      res.status(200).json({ message: 'Option deleted successfully' });
    } catch (error) {
      console.error(`Error deleting option: ${error}`);
      next(error);
    }
  };
}

module.exports = OptionController;
