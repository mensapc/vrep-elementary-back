const express = require("express");
const { validateToken } = require("../middlewares/validations");
const { authorize } = require("../middlewares/authorize");
const AnswerController = require("../controllers/answer.controller");

const router = express.Router();
const answerController = new AnswerController();

router.post("/answers", validateToken, authorize(["createAnswer"]), answerController.createAnswer);

module.exports = router;
