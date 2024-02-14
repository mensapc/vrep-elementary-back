const express = require('express');
const { validateToken } = require('../middlewares/validations');
const ClassController = require('../controllers/class.controller');
const { authorize } = require('../middlewares/authorize');
const classcontroller = new ClassController();
const router = express.Router();

router.post('/class', validateToken, authorize(['createClass']), classcontroller.createClass);
router.get('/classes', validateToken, classcontroller.getClasses);
router.get('/classes/:id', validateToken, authorize(['readClass']), classcontroller.getClassById);
router.get(
  '/classes/teacher/:id',
  validateToken,
  authorize(['readClass']),
  classcontroller.getClassByTeacherId
);
// router.delete(
//   '/delete/class/:classID',
//   validateToken,
//   authorize(['deleteClass']),
//   classcontroller.deleteClassByID
// );
router.put('/classes/:id', validateToken, authorize(['updateClass']), classcontroller.updateClass);
module.exports = router;

