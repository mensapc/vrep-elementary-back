const express = require('express');
const { validateToken } = require('../middlewares/validations');
const CourseController = require('../controllers/course.controller');
const { authorize } = require('../middlewares/authorize');
const courseController = new CourseController();
const router = express.Router();

router.post('/course', validateToken, authorize(['createCourse']), courseController.createCourse);
router.get('/courses', validateToken, courseController.getCourses);
router.get('/courses/:id', validateToken, courseController.getCourse);
router.put(
  '/course/teacher/assign',
  validateToken,
  authorize(['teacherCourse']),
  courseController.addTeacherToCourse
);
router.put(
  '/course/teacher/remove',
  validateToken,
  authorize(['teacherCourse']),
  courseController.removeTeacherFromCourse
);
router.put(
  '/courses/:id',
  validateToken,
  authorize(['updateCourse']),
  courseController.updateCourse
);
// router.post('/create/course_schema', validateToken, authorize(['createCourseData']), courseController.createCourseSchemData);
// router.get('/courses_scheme', validateToken, authorize(['getCoursesScheme']), courseController.getCourseSchemes)
// router.delete('/delete/course/:courseID', validateToken, authorize(['deletecourse']), courseController.deleteCourseByID)
// router.put('/update/courses_scheme/:courseScheme_ID', validateToken, authorize(['updateScheme']), courseController.updateCourseScheme)

module.exports = router;

