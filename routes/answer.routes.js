const express = require('express');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');
const AnswerController = require('../controllers/answer.controller');

const router = express.Router();
const answerController = new AnswerController();

router.post('/answer', validateToken, authorize(['createAnswer']), answerController.createAnswer);
router.get('/answers', validateToken, answerController.getAnswers);
router.put(
  '/answers/:id',
  validateToken,
  authorize(['updateAnswer']),
  answerController.updateAnswer
);

module.exports = router;
