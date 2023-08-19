const express = require('express');
const StudentAuthController = require('../controllers/student.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');
const router = express.Router();
const StudentController = new StudentAuthController();


router.post('/register-student/:userType', validateToken, authorize(['createStudent1']), StudentController.addStudent);
module.exports = router;