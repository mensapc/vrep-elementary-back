const express = require("express");
const { validateToken } = require("../middlewares/validations");
const { authorize } = require("../middlewares/authorize");
const GradeController = require("../controllers/grade.controller");

const router = express.Router();
const gradeController = new GradeController();

router.post("/grades", validateToken, authorize(["createGrade"]), gradeController.createGrade);
router.get("/grades/students/:student_id", validateToken, gradeController.getGradesByStudent);
router.get("/grades/exams/:exam_id", validateToken, gradeController.getGradesByExam);

module.exports = router;
