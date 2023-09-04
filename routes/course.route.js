const express = require('express');
const { validateToken } = require('../middlewares/validations');
const CourseController = require('../controllers/course.controller');
const { authorize } = require('../middlewares/authorize');
const courseController = new CourseController();
const router = express.Router();



router.post('/create/course', validateToken, authorize(['createCourse']), courseController.createCourse);
router.post('/create/course_schema', validateToken, authorize(['createCourseData']), courseController.createCourseSchemData);
router.get('/courses_scheme', validateToken, authorize(['getCoursesScheme']), courseController.getCourseSchemes)
router.get('/courses', validateToken, authorize(['readCourse']), courseController.getAllCourses);
router.get('/course/:courseId', validateToken, authorize(['readCourses']), courseController.getSingleCourse)
router.delete('/delete/course/:courseID', validateToken, authorize(['deletecourse']), courseController.deleteCourseByID)
router.put('/update/course/:courseID', validateToken, authorize(['updateCourse']), courseController.updateCourseByID)

module.exports = router;