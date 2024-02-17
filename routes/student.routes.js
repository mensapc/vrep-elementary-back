const express = require('express');
const StudentController = require('../controllers/student.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');
const multerMiddleware = require('../middlewares/multer.middleware');
const router = express.Router();
const studentController = new StudentController();

router.post(
  '/student/register',
  validateToken,
  authorize(['createStudent']),
  multerMiddleware,
  studentController.register
);

router.post('/student/login', studentController.login);

router.get('/students/:id', validateToken, studentController.getById);
router.post(
  '/students/search',
  validateToken,
  authorize(['searchStudent']),
  studentController.getBySearch
);

router.get('/students', validateToken, authorize(['readStudents']), studentController.getAll);

router.delete(
  '/students/:id',
  validateToken,
  authorize(['deleteStudent']),
  studentController.deleteStudent
);

router.put(
  '/students/:id',
  validateToken,
  authorize(['updateStudent']),
  multerMiddleware,
  studentController.updateStudent
);

module.exports = router;
