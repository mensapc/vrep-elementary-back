const jwt = require('jsonwebtoken');
const CustomError = require('../../utils/CustomError');
const User = require('../models/user');


NewUser = new User();

// Middleware to validate a JWT token

const validateToken = (req, res, next) => {
    if (!req.headers.authorization) throw new CustomError('Unauthorized', 401)
    const token = req.headers.authorization.split(' ')[1];
    try {
        if (!token) throw new CustomError('Unauthorized', 401);
        // Verify the token and decode its payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new Error('Invalid credentials', 401);
    }
}

const validateAdmin = async(req, res, next) => {
    try {
        // Validate if user is admin
        const user = req.user;
        const admin = await NewUser.findUserByEmail(user.email);
        if (admin.role !== 'admin') throw new CustomError('Unauthorized', 401);
        next();
    } catch (error) {
        console.error('Error creating student:', error);
        next(error);
    }
}

module.exports = { validateToken, validateAdmin };