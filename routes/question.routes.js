const express = require("express");
const { validateToken } = require("../middlewares/validations");
const { authorize } = require("../middlewares/authorize");
const QuestionController = require("../controllers/question.controller");

const router = express.Router();
const questionController = new QuestionController();

router.post(
  "/questions",
  validateToken,
  authorize(["createQuestion"]),
  questionController.createQuestion
);

router.delete(
  "/questions/:question_id",
  validateToken,
  authorize(["deleteQuestion"]),
  questionController.deleteQuestionById
);

module.exports = router;
