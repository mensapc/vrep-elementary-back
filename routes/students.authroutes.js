const express = require('express');
const StudentAuthController = require('../controllers/student.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');
const router = express.Router();
const StudentController = new StudentAuthController();


router.post('/register-student/:userType', validateToken, authorize(['createStudent1']), StudentController.addStudent);
router.get('/single/student', validateToken, authorize(['readStudent']), StudentController.getSingleStudent);
router.get('/students', validateToken, authorize(['readStudents']), StudentController.getAllStudents)
router.delete('/delete/student/:reg_number', validateToken, authorize(['deleteStudent']), StudentController.deleteStudent);
router.put('/update', validateToken, authorize(['updateStudent']), StudentController.updateStudent)

module.exports = router;