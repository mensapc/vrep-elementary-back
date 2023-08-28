const express = require("express");
const { validateToken } = require("../middlewares/validations");
const { authorize } = require("../middlewares/authorize");
const ExamController = require("../controllers/exam.controller");

const router = express.Router();
const examController = new ExamController();

router.post("/exams/new", validateToken, authorize(["createExam"]), examController.createExam);

module.exports = router;
