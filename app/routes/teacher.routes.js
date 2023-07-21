const express = require('express');
const TeacherController = require('../controllers/teacher.controller');
const { validateToken, validateAdmin } = require('../middlewares/validations');

const router = express.Router();
const teacherController = new TeacherController();

router.post('/teacher/new', validateToken, validateAdmin, teacherController.createTeacher);
router.get('/teachers', validateToken, validateAdmin, teacherController.getAllTeachers);
router.get('/teachers/:id', validateToken, teacherController.getTeacherById);
router.put('/teachers/:id', validateToken, validateAdmin, teacherController.updateTeacherById);

module.exports = router;