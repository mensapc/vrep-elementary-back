const express = require('express');
const AdminController = require('../controllers/admin.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');
const multerMiddleware = require('../middlewares/multer.middleware');

const router = express.Router();
const adminController = new AdminController();

router.post(
  '/admin/register',
  validateToken,
  authorize(['createAdmin']),
  multerMiddleware,
  adminController.register
);
router.post('/admin/login', adminController.login);
router.post('/admin/forgot-password', adminController.forgetPassowrd);
router.put(
  '/admin/update-password',
  validateToken,
  adminController.updatePassword
);

module.exports = router;
