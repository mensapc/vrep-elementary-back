const Question = require("../models/question");

class QuestionController {
  createQuestion = async (req, res, next) => {
    const questionData = req.body;

    try {
      const newQuestion = await Question.create(questionData);
      res.status(200).json({ question: newQuestion });
    } catch (error) {
      console.error(`Error creating question: ${error}`);
      next(error);
    }
  };
}

module.exports = QuestionController;
