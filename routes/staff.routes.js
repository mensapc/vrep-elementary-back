
const express = require('express');
const { validateToken } = require('../middlewares/validations');
const StaffController = require('../controllers/staff.controllers');
const { authorize } = require('../middlewares/authorize');
const staffController = new StaffController();
const router = express.Router();



router.get('/all/staff', validateToken, authorize(['readStaff']), staffController.findAllStaff);
router.delete('/delete/staff/:staff_id', validateToken, authorize(['deleteStaff']), staffController.deleteStaffById);
router.get('/Single/staff/:staff_id', validateToken, authorize(['readStaff']), staffController.getStaffById);
router.put('/update/staff/:staff_id', validateToken, authorize(['updateStaff']), staffController.updateStaffById)
module.exports = router;