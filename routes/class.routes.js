const express = require('express');
const { validateToken } = require('../middlewares/validations');
const ClassController = require('../controllers/class.controller');
const { authorize } = require('../middlewares/authorize');
const classcontroller = new ClassController();
const router = express.Router();

router.post('/class', validateToken, authorize(['createClass']), classcontroller.createClass);
router.get('/classes', validateToken, classcontroller.getClasses);
// router.get(
//   '/single/class/:classID',
//   validateToken,
//   authorize(['readSingleClass']),
//   classcontroller.getSingleClass
// );
// router.delete(
//   '/delete/class/:classID',
//   validateToken,
//   authorize(['deleteClass']),
//   classcontroller.deleteClassByID
// );
// router.put(
//   '/update/class/:classID',
//   validateToken,
//   authorize(['updateClass']),
//   classcontroller.updateClassByID
// );
module.exports = router;
