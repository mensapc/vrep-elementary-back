const { Query } = require("firefose");
const Exam = require("../models/exam");
const QuestionController = require("./question.controller");
const {
  calculateMarks,
  checkExamAvailability,
  examDuration,
  validateExamDuration,
} = require("../utils/utils.exam");
const CustomError = require("../utils/CustomError");

class ExamController {
  constructor() {
    this.questionController = new QuestionController();
  }
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
      if (req.user.role === "pupil") {
        // check if exam is available
        const examAvailability = checkExamAvailability(exam);
        if (!examAvailability.is_available) throw new CustomError(examAvailability.message, 403);
      }
      const questionsWithOptions = await this.questionController.examQuestionsWithOptions(exam.id);
      res.status(200).json({ exam: { ...exam, questions: questionsWithOptions } });
    } catch (error) {
      console.error(`Error getting exam: ${error}`);
      next(error);
    }
  };

  updateExam = async (req, res, next) => {
    const { exam_id } = req.params;
    const examData = req.body;
    try {
      if (examData.time_limit) {
        throw new CustomError("Exam duration can be updated via start date and end date", 400);
      }
      console.log(examData);
      if (examData.start_date || examData.end_date) {
        // validate exam duration
        const durationValidate = validateExamDuration(examData);
        if (!durationValidate.is_valid) throw new CustomError(durationValidate.message, 400);

        // calculate exam duration
        const duration = examDuration(examData);
        if (!duration.is_valid) throw new CustomError(duration.message, 400);
        examData.time_limit = duration.duration;
      }
      const updatedExam = await Exam.updateById(exam_id, examData);
      res.status(200).json({ exam: updatedExam });
    } catch (error) {
      console.error(`Error updating exam: ${error}`);
      next(error);
    }
  };

  deleteExam = async (req, res, next) => {
    const { exam_id } = req.params;
    try {
      await this.questionController.deleteExamQuestions(exam_id);
      await Exam.deleteById(exam_id);
      res.status(200).json({ message: "Exam deleted successfully" });
    } catch (error) {
      console.error(`Error deleting exam: ${error}`);
      next(error);
    }
  };

  getExamResults = async (req, res, next) => {
    const { student_id, exam_id } = req.params;
    try {
      const exam = await Exam.findById(exam_id);
      const questionsWithAnswers = await this.questionController.QuestionsWithOptionsAndAnswers(
        exam.id,
        student_id
      );
      const studentMarks = calculateMarks(exam, questionsWithAnswers);
      res
        .status(200)
        .json({ exam: { ...exam, questions: questionsWithAnswers }, student_marks: studentMarks });
    } catch (error) {
      console.error(`Error getting exam: ${error}`);
      next(error);
    }
  };
}

module.exports = ExamController;
