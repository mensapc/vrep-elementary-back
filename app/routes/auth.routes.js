const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { validateToken, validateAdmin } = require('../middlewares/validations');

const router = express.Router();
const authController = new AuthController();

router.post('/register', validateToken, validateAdmin, authController.register);
router.post('/login', authController.login);

module.exports = router;