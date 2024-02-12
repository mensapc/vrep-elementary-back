const express = require('express');
const StaffController = require('../controllers/staff.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');
const staffController = new StaffController();
const router = express.Router();

router.post('/staff/register', validateToken, authorize(['createStaff']), staffController.register);

router.post('/staff/login', staffController.login);

router.get('/staff', validateToken, authorize(['readStaff']), staffController.findAllStaff);

router.get(
	'/staff/:staff_id',
	validateToken,
	authorize(['readStaff']),
	staffController.getStaffById
);

router.put(
	'/staff/:staff_id',
	validateToken,
	authorize(['updateStaff']),
	staffController.updateStaffById
);

router.delete(
	'/staff/:staff_id',
	validateToken,
	authorize(['deleteStaff']),
	staffController.deleteStaffById
);
module.exports = router;

