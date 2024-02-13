const Answer = require('../models/answer');
const CustomError = require('../utils/CustomError');

class AnswerController {
  createAnswer = async (req, res, next) => {
    const answerData = req.body;
    try {
      const answer = await Answer.create(answerData);
      return res.status(200).json(answer);
    } catch (error) {
      console.error(`Error creating answer: ${error}`);
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
