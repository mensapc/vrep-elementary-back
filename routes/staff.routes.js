const express = require('express');
const StaffController = require('../controllers/staff.controller');
const { authorize } = require('../middlewares/authorize');
const { validateToken } = require('../middlewares/validations');
const multerMiddleware = require('../middlewares/multer.middleware');
const staffController = new StaffController();
const router = express.Router();

router.post(
  '/staff/register',
  validateToken,
  authorize(['createStaff']),
  multerMiddleware,
  staffController.register
);

router.post('/staff/login', staffController.login);

router.post('/staff/forgot-password', staffController.forgetPassowrd);

router.put(
  '/staff/update-password',
  validateToken,
  staffController.updatePassword
);

router.get(
  '/staff',
  validateToken,
  authorize(['readStaff']),
  staffController.getAll
);

router.get(
  '/staff/:id',
  validateToken,
  authorize(['readStaff']),
  staffController.getById
);

router.put(
  '/staff/:id',
  validateToken,
  authorize(['updateStaff']),
  multerMiddleware,
  staffController.updateStaff
);

router.post(
  '/staff/sort',
  validateToken,
  authorize(['readStaff']),
  staffController.staffBySort
);

router.delete(
  '/staff/:id',
  validateToken,
  authorize(['deleteStaff']),
  staffController.deleteStaff
);

module.exports = router;
