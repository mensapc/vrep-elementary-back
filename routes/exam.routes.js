const express = require("express");
const { validateToken } = require("../middlewares/validations");
const { authorize } = require("../middlewares/authorize");
const ExamController = require("../controllers/exam.controller");

const router = express.Router();
const examController = new ExamController();

router.post("/exams", validateToken, authorize(["createExam"]), examController.createExam);
router.get("/exams", validateToken, authorize(["getExams"]), examController.getExams);
router.get("/exams/:exam_id", validateToken, examController.getExam);

module.exports = router;
