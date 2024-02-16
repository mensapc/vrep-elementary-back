const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');
const ExamController = require('../controllers/exam.controller');

const router = express.Router();
const examController = new ExamController();

router.post('/exam', validateToken, authorize(['createExam']), examController.createExam);
router.get('/exams', validateToken, authorize(['getExams']), examController.getExams);
router.get('/exams/:id', validateToken, authorize(['getExamSummary']), examController.getExam);
router.get('/exams/:id/full', validateToken, examController.getExamWithQustionsAndOptions);
router.post('/exam/result', validateToken, examController.getExamResults);
router.put('/exams/:id', validateToken, authorize(['updateExam']), examController.updateExam);
router.delete('/exams/:id', validateToken, authorize(['deleteExam']), examController.deleteExam);

module.exports = router;
