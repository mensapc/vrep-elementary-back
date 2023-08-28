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

module.exports = router;
