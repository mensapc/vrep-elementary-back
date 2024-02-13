const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');
const QuestionController = require('../controllers/question.controller');

const router = express.Router();
const questionController = new QuestionController();

router.post(
  '/question',
  validateToken,
  authorize(['createQuestion']),
  questionController.createQuestion
);

router.get('/questions/:id', validateToken, questionController.getQuestions);

router.delete(
  '/questions/:question_id',
  validateToken,
  authorize(['deleteQuestion']),
  questionController.deleteQuestionById
);

module.exports = router;
