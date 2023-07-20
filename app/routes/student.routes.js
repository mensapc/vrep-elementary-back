const express = require('express');
const StudentController = require('../controllers/student.controller');
const { validateToken, validateAdmin } = require('../middlewares/validations');

const router = express.Router();
const studentController = new StudentController();

router.post('/student/new', validateToken, validateAdmin, studentController.createStudent);

module.exports = router;