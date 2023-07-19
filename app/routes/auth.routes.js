const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { validateToken } = require('../middlewares/validations');

const router = express.Router();
const authController = new AuthController();

router.post('/register', validateToken, authController.register);
router.post('/login', authController.login);

module.exports = router;