const { Query } = require("firefose");
const Grade = require("../models/grade");

class GradeController {
  createGrade = async (req, res, next) => {
    const gradeData = req.body;

    try {
      const newGrade = await Grade.create(gradeData);
      res.status(200).json({ grade: newGrade });
    } catch (error) {
      console.error(`Error creating grade: ${error}`);
      next(error);
    }
  };

  getGradesByStudent = async (req, res, next) => {
    const { student_id } = req.params;
    try {
      const query = new Query().where("student_id", "==", student_id);
      const grades = await Grade.find(query);
      res.status(200).json({ grades });
    } catch (error) {
      console.error(`Error getting grades: ${error}`);
      next(error);
    }
  };

  getGradesByExam = async (req, res, next) => {
    const { exam_id } = req.params;
    try {
      const query = new Query().where("exam_id", "==", exam_id);
      const grades = await Grade.find(query);
      res.status(200).json({ grades });
    } catch (error) {
      console.error(`Error getting grades: ${error}`);
      next(error);
    }
  };
}

module.exports = GradeController;
