const Result = require('../models/result');
const CustomError = require('../utils/CustomError');
const { convertSchoolTerms } = require('../utils/utils.common');
const { ExamDetailsAndAnswers, CalculateResults } = require('../utils/utils.exam');
const {
  checkResultExistence,
  groupedStudentsResults,
  findResultMarks,
  uniqueResultsCourses,
  findFailedAndPassExams,
} = require('../utils/utils.result');

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
        start_date: results.start_date,
        end_date: results.end_date,
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

  getStudentExamResults = async (req, res, next) => {
    const { student_id } = req.params;
    try {
      const results = await Result.find({ student: student_id }).populate([
        { path: 'student' },
        { path: '_class', select: 'name' },
        { path: 'course', select: 'name' },
        { path: 'staff', select: 'first_name last_name' },
      ]);
      if (!results.length) throw new CustomError('No results found', 404);
      const uniqueCourses = uniqueResultsCourses(results);
      const { pass_count, fail_count } = findFailedAndPassExams(results);

      res.status(200).json({
        total_courses: uniqueCourses,
        attempt: results.length,
        results,
        pass_count,
        fail_count,
      });
    } catch (error) {
      console.error(`Error getting student results: ${error}`);
      next(error);
    }
  };
  
  getStudentOverAllExamResults = async (req, res, next) => {
    const { student_id } = req.params;
    try {
      const results = await Result.find({ student: student_id }).populate([
        { path: 'student' },
        { path: '_class', select: 'name' },
        { path: 'course', select: 'name' },
        { path: 'staff', select: 'first_name last_name' },
      ]);
      if (!results.length) throw new CustomError('No results found', 404);
  
      // Calculate overall total score
      let overallTotalScore = 0;
      results.forEach(result => {
        // Assuming each result object has a 'score' field representing the score obtained
        overallTotalScore += result.total;
      });
      const uniqueCourses = uniqueResultsCourses(results);
      const { pass_count, fail_count } = findFailedAndPassExams(results);
  
      res.status(200).json({
        total_courses: uniqueCourses,
        attempt: results.length,
        overall_total_score: overallTotalScore, // Add overall total score to response
        results,
      });
    } catch (error) {
      console.error(`Error getting student results: ${error}`);
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

  generateStudentReport = async (req, res, next) => {
    const { _class, school_term, academic_year, student } = req.body;

    try {
      const results = await Result.find({
        _class: _class,
        school_term,
        academic_year,
        student: student,
      }).populate([
        {
          path: 'student',
          select: '-_class',
        },
        { path: '_class', select: 'name' },
        { path: 'course', select: 'name' },
      ]);

      if (!results.length) throw new CustomError('No Exam results found', 404);

      const formatSchoolTerm = convertSchoolTerms(results[0].school_term);
      const formatAcademicYear = `${results[0].academic_year}/${
        Number(results[0].academic_year) + 1
      }`;
      const marks = findResultMarks(results);

      res.status(200).json({
        _class: results[0]._class,
        student: results[0].student,
        school_term: formatSchoolTerm,
        academic_year: formatAcademicYear,
        student_marks: marks,
      });
    } catch (error) {
      console.error(`Error generating report: ${error}`);
      next(error);
    }
  };
}

module.exports = ResultController;
