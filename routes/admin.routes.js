const express = require('express');
const AdminController = require('../controllers/admin.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');

const router = express.Router();
const adminController = new AdminController();

router.post('/admin/register', validateToken, authorize(['createAdmin']), adminController.register);
router.post('/login/admin', adminController.login);

module.exports = router;
