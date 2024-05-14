const express = require("express");
const { validateToken } = require("../middlewares/validations");
const CourseController = require("../controllers/course.controller");
const { authorize } = require("../middlewares/authorize");
const courseController = new CourseController();
const router = express.Router();

router.post(
  "/course",
  validateToken,
  authorize(["createCourse"]),
  courseController.createCourse
);
router.get("/courses", validateToken, courseController.getCourses);
router.get("/courses/:id", validateToken, courseController.getCourse);
router.put(
  "/course/teacher/assign",
  validateToken,
  authorize(["teacherCourse"]),
  courseController.addTeacherToCourse
);
router.put(
  "/course/teacher/remove",
  validateToken,
  authorize(["teacherCourse"]),
  courseController.removeTeacherFromCourse
);
router.put(
  "/courses/:id",
  validateToken,
  authorize(["updateCourse"]),
  courseController.updateCourse
);
router.delete(
  "/courses/:id",
  validateToken,
  authorize(["deletecourse"]),
  courseController.deleteCourse
);

router.post(
  "/courses/search",
  validateToken,
  courseController.getCoursesBySearch
);

router.get(
  "/courses/staff/:staffId",
  validateToken,
  courseController.getCoursesByStaff
);

module.exports = router;
