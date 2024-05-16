const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');
const ResultController = require('../controllers/result.controller');

const router = express.Router();
const resultController = new ResultController();

// router.post('/result', validateToken, resultController.createResult);
// router.post(
//   '/result/exam-details',
//   validateToken,
//   authorize(['examResult']),
//   resultController.getExamResultDetails
// );
// router.post(
//   '/result/students-done-exams',
//   validateToken,
//   authorize(['examResult']),
//   resultController.getStudentsDoneExams
// );
// router.post('/result/student-report', validateToken, resultController.generateStudentReport);

// router.put('/result/:id', validateToken, authorize(['examResult']), resultController.updateResults);
// router.get(
//   '/result/student-exam-results/:student_id',
//   validateToken,
//   resultController.getStudentExamResults
// );
// router.get(
//   '/result/student-exam-over-all-results/:student_id',
//   validateToken,
//   resultController.getStudentOverAllExamResults
// );

router.post('/result2', validateToken, resultController.addResult);
module.exports = router;
