const mongoose = require('mongoose');
const Grade = require('../models/grade');
const { ExamDetailsAndAnswers, CalculateResults } = require('../utils/utils.exam');
const { checkGradeExistence } = require('../utils/utils.grade');
const CustomError = require('../utils/CustomError');

class GradeController {
  createGrade = async (req, res, next) => {
    const { exam_id, student_id } = req.body;

    try {
      const gradeExist = await checkGradeExistence(exam_id, student_id);
      if (gradeExist) throw new CustomError('Grade already exists', 400);

      const { exam, answers } = await ExamDetailsAndAnswers(exam_id, student_id, session);
      const results = CalculateResults(exam, answers);
      const grade = await Grade.create({
        total: results.totalMarks,
        percentage: results.percentage,
        score: results.scoredMarks,
        student: student_id,
        course: results.course,
        class: results.student_class,
        exam: exam_id,
      });
      res.status(200).json(grade);
    } catch (error) {
      console.error(`Error calculating result: ${error}`);
      next(error);
    }
  };

  getGradesBySearch = async (req, res, next) => {
    const query = req.query;
    try {
      const grades = await Grade.find(query);
      res.status(200).json({ grades });
    } catch (error) {
      console.error(`Error getting grades: ${error}`);
      next(error);
    }
  };
}

module.exports = GradeController;
