const express = require("express");
const StudentController = require("../controllers/student.controller");
const { authorize } = require("../middlewares/authorize");
const { validateToken } = require("../middlewares/validations");
const router = express.Router();
const studentController = new StudentController();

router.post(
  "/register/student",
  validateToken,
  authorize(["createStudent"]),
  studentController.register
);

router.post("/login/student", studentController.login);

router.get("/students/:id", validateToken, studentController.getById);
router.post(
  "/students/search",
  validateToken,
  authorize(["searchStudent"]),
  studentController.getBySearch
);

router.get("/students", validateToken, authorize(["readStudents"]), studentController.getAll);

router.delete(
  "/students/:id",
  validateToken,
  authorize(["deleteStudent"]),
  studentController.deleteStudent
);

router.put(
  "/students/:id",
  validateToken,
  authorize(["updateStudent"]),
  studentController.updateStudent
);

module.exports = router;
