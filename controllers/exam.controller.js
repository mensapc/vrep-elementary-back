const { Query } = require("firefose");
const Exam = require("../models/exam");
const QuestionController = require("./question.controller");

class ExamController {
  constructor() {
    this.questionController = new QuestionController();
  }
  createExam = async (req, res, next) => {
    const examData = req.body;

    try {
      const newExam = await Exam.create({ ...examData, staff_id: req.user.staff_id });
      res.status(200).json({ exam: newExam });
    } catch (error) {
      console.error(`Error creating exam: ${error}`);
      next(error);
    }
  };

  getExams = async (req, res, next) => {
    try {
      const query = new Query();
      const exams = await Exam.find(query);
      res.status(200).json({ exams });
    } catch (error) {
      console.error(`Error getting exams: ${error}`);
      next(error);
    }
  };

  getExam = async (req, res, next) => {
    const { exam_id } = req.params;
    try {
      const exam = await Exam.findById(exam_id);
      const questionsWithOptions = await this.questionController.examQuestionsWithOptions(exam.id);
      res.status(200).json({ exam: { ...exam, questions: questionsWithOptions } });
    } catch (error) {
      console.error(`Error getting exam: ${error}`);
      next(error);
    }
  };

  getExamResults = async (req, res, next) => {
    const { student_id, exam_id } = req.params;
    try {
      const exam = await Exam.findById(exam_id);
      const questionsWithOptions = await this.questionController.QuestionsWithOptionsAndAnswers(
        exam.id,
        student_id
      );
      res.status(200).json({ exam: { ...exam, questions: questionsWithOptions } });
    } catch (error) {
      console.error(`Error getting exam: ${error}`);
      next(error);
    }
  };
}

module.exports = ExamController;
