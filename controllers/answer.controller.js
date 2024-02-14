const Answer = require('../models/answer');
const CustomError = require('../utils/CustomError');

class AnswerController {
  createAnswer = async (req, res, next) => {
    const answerData = req.body;
    try {
      const answerExist = await Answer.findOne({
        question: answerData.question,
        student: answerData.student,
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
    const { chosen_option } = req.body;
    try {
      const updatedAnswer = await Answer.findByIdAndUpdate(id, { chosen_option }, { new: true });
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

  studentAnswer = async (student_id, question_id) => {
    try {
      const query = new Query()
        .where('student_id', '==', student_id)
        .where('question_id', '==', question_id);
      const answer = await Answer.find(query);
      return answer;
    } catch (error) {
      console.error(`Error getting options: ${error}`);
      throw new Error(error);
    }
  };

  deleteQuestionAnswers = async (question_id) => {
    try {
      const query = new Query().where('question_id', '==', question_id);
      const answers = await Answer.delete(query);
      return answers;
    } catch (error) {
      console.error(`Error deleting answers: ${error}`);
      throw new Error(error);
    }
  };
}

module.exports = AnswerController;
