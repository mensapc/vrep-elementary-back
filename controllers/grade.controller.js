const mongoose = require('mongoose');
const Grade = require('../models/grade');
const { ExamDetailsAndAnswers, CalculateResults, passMark } = require('../utils/utils.exam');
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
        school_term: results.school_term,
        academic_year: results.academic_year,
        staff: results.staff,
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

  updateGrade = async (req, res, next) => {
    const { id } = req.params;
    const { grade } = req.body;

    try {
      const updatedGrade = await Grade.findByIdAndUpdate(id, { $set: { grade } }, { new: true });
      if (!updatedGrade) throw new CustomError('Grade not found', 404);
      res.status(200).json(updatedGrade);
    } catch (error) {
      console.error(`Error updating grade: ${error}`);
      next(error);
    }
  };

  passMark = () => {
    return passed = 50
  }

  getGradeStatistics = async (req, res, next) => {
    try {
      // Find all grades
      const grades = await Grade.find();
  
      // Filter grades below and above pass mark
      const belowPassMarkGrades = grades.filter(grade => grade.score < passMark());
      const abovePassMarkGrades = grades.filter(grade => grade.score >= passMark());
  
      // Sort grades by score in ascending order to get the lowest grade
      const lowestGrade = belowPassMarkGrades.sort((a, b) => a.score - b.score)[0];
  
      // Sort grades by score in descending order to get the highest grade
      const highestGrade = abovePassMarkGrades.sort((a, b) => b.score - a.score)[0];
  
      // Send the lowest and highest grades in the response
      res.status(200).json({ lowestGrade, highestGrade });
    } catch (error) {
      console.error(`Error getting grade statistics: ${error}`);
      next(error);
    }
  };

}

module.exports = GradeController;