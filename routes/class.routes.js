const express = require('express');
const { validateToken } = require('../middlewares/validations');
const ClassController = require('../controllers/class.controller');
const { authorize } = require('../middlewares/authorize');
const classcontroller = new ClassController();
const router = express.Router();

router.post('/class', validateToken, authorize(['createClass']), classcontroller.createClass);
router.get('/classes', validateToken, classcontroller.getClasses);
router.get('/classes/:id', validateToken, authorize(['readClass']), classcontroller.getClassById);
router.get('/classpupil', validateToken, classcontroller.getNumberOfStudents);
router.get(
  '/classes/teacher/:id',
  validateToken,
  authorize(['readClass']),
  classcontroller.getClassByTeacherId
);
router.delete(
  '/classes/:id',
  validateToken,
  authorize(['deleteClass']),
  classcontroller.deleteClass
);
router.put('/classes/:id', validateToken, authorize(['updateClass']), classcontroller.updateClass);
router.post(
  '/class/course/add',
  validateToken,
  authorize(['courseClass']),
  classcontroller.addCourseToClass
);
router.put(
  '/class/course/remove',
  validateToken,
  authorize(['courseClass']),
  classcontroller.removeCourseFromClass
);
module.exports = router;

