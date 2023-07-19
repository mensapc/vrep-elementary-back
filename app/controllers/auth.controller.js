const CustomError = require('../../utils/CustomError');
const User = require('../models/user');
const AuthService = require('../services/auth.service');

class AuthController {
    constructor() {
        this.authService = new AuthService();
        this.user = new User();
    }

    // Method to register a new user
    register = async(req, res, next) => {
        try {
            // Validate if user is admin
            const user = req.user;
            const admin = await this.user.findUserByEmail(user.email);
            console.log(admin);
            if (admin.role !== 'admin') throw new CustomError('Unauthorized', 401);

            // Register user
            const data = req.body;
            const result = await this.authService.register(data);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error registering user:', error);
            next(error);
        }
    };

    // Method to handle user login
    login = async(req, res, next) => {
        try {
            const data = req.body;
            const result = await this.authService.login(data);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error logging in user:', error);
            next(error);
        }
    };
}

module.exports = AuthController;