const { Query } = require("firefose");
const Question = require("../models/question");
const OptionController = require("./option.controller");

class QuestionController {
  constructor() {
    this.optionController = new OptionController();
  }

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

  getExamQuestionsWithOptions = async (exam_id) => {
    try {
      const query = new Query().where("exam_id", "==", exam_id);
      const examQuestions = await Question.find(query);
      const questionsWithOptions = await Promise.all(
        examQuestions.map(async (question) => {
          const options = await this.optionController.getQuestionOptions(question.id);
          return { ...question, options };
        })
      );
      return questionsWithOptions;
    } catch (error) {
      console.error(`Error getting questions: ${error}`);
      throw new Error(error);
    }
  };
}

module.exports = QuestionController;
