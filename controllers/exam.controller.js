const { Query } = require("firefose");
const Exam = require("../models/exam");

class ExamController {
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
}

module.exports = ExamController;
