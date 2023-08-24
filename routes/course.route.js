const express = require('express');
const { validateToken } = require('../middlewares/validations');
const CourseController = require('../controllers/course.controller');
const { authorize } = require('../middlewares/authorize');
const courseController = new CourseController();
const router = express.Router();



router.post('/create/course', validateToken, authorize(['createCourse']), courseController.createCourse);
router.get('/courses', validateToken, authorize(['readCourse']), courseController.getAllCourses);
router.post('/course/:userType', validateToken, authorize(['readCourses']), courseController.getSingleCourse)
router.delete('/delete/course', validateToken, authorize(['deletecourse']), courseController.deleteCourseByID)

module.exports = router;