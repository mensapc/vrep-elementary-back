
const express = require('express');
const { validateToken } = require('../middlewares/validations');
const StaffController = require('../controllers/staff.controllers');
const { authorize } = require('../middlewares/authorize');
const staffController = new StaffController();
const router = express.Router();



router.get('/all/staff', validateToken, authorize(['readStaff']), staffController.findAllStaff);
router.delete('/no/staff/:staff_id', validateToken, authorize(['deleteStaff']), staffController.deleteStaffById);
router.post('/Single/staff', validateToken, authorize(['readStaff']), staffController.getStaffById);
router.put('/update/staff', validateToken, authorize(['updateStaff']), staffController.updateStaffById)
module.exports = router;