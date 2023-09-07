const { Query } = require("firefose");
const Question = require("../models/question");
const OptionController = require("./option.controller");
const AnswerController = require("./answer.controller");

class QuestionController {
  constructor() {
    this.optionController = new OptionController();
    this.answerController = new AnswerController();
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

  examQuestionsWithOptions = async (exam_id) => {
    try {
      const query = new Query().where("exam_id", "==", exam_id);
      const examQuestions = await Question.find(query);
      const questionsWithOptions = await Promise.all(
        examQuestions.map(async (question) => {
          const options = await this.optionController.questionwithOptionsAndAnswer(question.id);
          return { ...question, options };
        })
      );
      return questionsWithOptions;
    } catch (error) {
      console.error(`Error getting questions: ${error}`);
      throw new Error(error);
    }
  };
  QuestionsWithOptionsAndAnswers = async (exam_id, student_id) => {
    try {
      const query = new Query().where("exam_id", "==", exam_id);
      const examQuestions = await Question.find(query);
      const optionsAndAnswer = await Promise.all(
        examQuestions.map(async (question) => {
          const options = await this.optionController.questionwithOptionsAndAnswer(question.id);
          const answer = await this.answerController.studentAnswer(student_id, question.id);
          return { ...question, options, answer };
        })
      );
      return optionsAndAnswer;
    } catch (error) {
      console.error(`Error getting questions: ${error}`);
      throw new Error(error);
    }
  };

  deleteQuestion = async (question_id) => {
    try {
      await this.optionController.deleteQuestionOptions(question_id);
      await this.answerController.deleteQuestionAnswers(question_id);
      await Question.deleteById(question_id);
      return;
    } catch (error) {
      console.error(`Error deleting question: ${error}`);
      throw new Error(error);
    }
  };

  deleteQuestionById = async (req, res, next) => {
    const { question_id } = req.params;
    try {
      await this.deleteQuestion(question_id);
      res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
      console.error(`Error deleting question: ${error}`);
      next(error);
    }
  };

  deleteExamQuestions = async (exam_id) => {
    try {
      const query = new Query().where("exam_id", "==", exam_id);
      const questions = await Question.find(query);
      await Promise.all(
        questions.map(async (question) => {
          await this.deleteQuestion(question.id);
        })
      );
      return;
    } catch (error) {
      console.error(`Error deleting questions: ${error}`);
      throw new Error(error);
    }
  };
}

module.exports = QuestionController;
