const Result = require('../models/result');
const CustomError = require('../utils/CustomError');
const { convertSchoolTerms } = require('../utils/utils.common');
const { ExamDetailsAndAnswers, CalculateResults } = require('../utils/utils.exam');
const { checkResultExistence, groupedStudentsResults } = require('../utils/utils.result');

class ResultController {
  createResult = async (req, res, next) => {
    const { exam_id, student_id } = req.body;

    try {
      const resultExist = await checkResultExistence(exam_id, student_id);
      if (resultExist) throw new CustomError('You arleady submitted your result', 400);

      const { exam, answers } = await ExamDetailsAndAnswers(exam_id, student_id);
      const results = CalculateResults(exam, answers);
      const result = await Result.create({
        total: results.totalMarks,
        percentage: results.percentage,
        score: results.scoredMarks,
        school_term: results.school_term,
        academic_year: results.academic_year,
        staff: results.staff,
        student: student_id,
        course: results.course,
        _class: results.student_class,
        exam: exam_id,
      });
      res.status(200).json(result);
    } catch (error) {
      console.error(`Error calculating result: ${error}`);
      next(error);
    }
  };

  getExamResultDetails = async (req, res, next) => {
    const { exam_id, student_id } = req.body;
    try {
      const { exam, answers } = await ExamDetailsAndAnswers(exam_id, student_id);
      const results = CalculateResults(exam, answers);
      res.status(200).json(results);
    } catch (error) {
      console.error(`Error calculating result: ${error}`);
      next(error);
    }
  };

  getStudentsDoneExams = async (req, res, next) => {
    const data = req.body;
    try {
      const results = await Result.find(data).populate([
        { path: 'student', select: 'first_name last_name reg_number' },
        { path: '_class', select: 'name' },
      ]);
      if (!results.length) throw new CustomError('No results found', 404);
      const _class = results[0]._class.name;
      const school_term = convertSchoolTerms(results[0].school_term);
      const groupedResults = groupedStudentsResults(results);
      res.status(200).json({
        _class,
        school_term,
        data: groupedResults,
      });
    } catch (error) {
      console.error(`Error getting students done exams: ${error}`);
      next(error);
    }
  };
  updateResults = async (req, res, next) => {
    const { id } = req.params;
    const updatedData = req.body;
    try {
      const updatedResult = await Result.findByIdAndUpdate(id, updatedData, { new: true });
      res.status(200).json(updatedResult);
    } catch (error) {
      console.error(`Error updating result: ${error}`);
      next(error);
    }
  };
}

module.exports = ResultController;
