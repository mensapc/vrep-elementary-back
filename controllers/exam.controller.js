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
}

module.exports = ExamController;
