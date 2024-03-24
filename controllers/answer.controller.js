const Answer = require('../models/answer');
const CustomError = require('../utils/CustomError');

class AnswerController {
  createAnswer = async (req, res, next) => {
    const answerData = req.body;
    try {
      const answerExist = await Answer.findOne({
        question: answerData.question,
        student: answerData.student,
        class: answerData.class,
      });
      if (answerExist)
        throw new CustomError(
          'You have already answered this question, consider to update the answer instead!',
          400
        );

      const answer = await Answer.create(answerData);
      return res.status(200).json(answer);
    } catch (error) {
      console.error(`Error creating answer: ${error}`);
      next(error);
    }
  };

  updateAnswer = async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedAnswer = await Answer.findByIdAndUpdate(id, data, { new: true });
      if (!updatedAnswer) throw new CustomError('Answer id you provided not found', 404);
      return res.status(200).json(updatedAnswer);
    } catch (error) {
      console.error(`Error updating answer: ${error}`);
      next(error);
    }
  };

  getAnswers = async (req, res, next) => {
    try {
      const answers = await Answer.find();
      
      return res.status(200).json(answers);
    } catch (error) {
      console.error(`Error getting answers: ${error}`);
      next(error);
    }
  };
}

module.exports = AnswerController;
