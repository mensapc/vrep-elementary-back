const express = require('express');
const StudentController = require('../controllers/student.controller');
const { validateToken, validateAdmin } = require('../middlewares/validations');

const router = express.Router();
const studentController = new StudentController();

router.post('/student/new', validateToken, validateAdmin, studentController.createStudent);
router.get('/students', validateToken, validateAdmin, studentController.getAllStudents);
router.get('/students/:id', validateToken, studentController.getStudentById);

module.exports = router;