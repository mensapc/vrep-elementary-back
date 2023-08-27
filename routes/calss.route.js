const express = require('express');
const { validateToken } = require('../middlewares/validations');
const ClassController = require('../controllers/class.controller');
const { authorize } = require('../middlewares/authorize');
const classcontroller = new ClassController();
const router = express.Router();



router.post('/create/class', validateToken, authorize(['createClass']), classcontroller.createClassAndReferenceStaff);
router.get('/class', validateToken, authorize(['readClass']), classcontroller.getAllClasses);
router.get('/single/class/:classID', validateToken, authorize(['readSingleClass']), classcontroller.getSingleClass)

module.exports = router;