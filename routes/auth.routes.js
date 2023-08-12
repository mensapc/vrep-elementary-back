const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { validateToken } = require('../middlewares/validations');
const { authorize } = require('../middlewares/authorize');

const router = express.Router();
const authController = new AuthController();

router.post(
  '/register/:userType',
  validateToken,
  authorize(['createStudent', 'createAdmin', 'createStaff']),
  authController.register
);
module.exports = router;
