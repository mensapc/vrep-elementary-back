const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();
const authController = new AuthController();

router.post('/register', authController.register);
module.exports = router;
