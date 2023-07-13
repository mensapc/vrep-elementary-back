const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CustomError = require('../../utils/CustomError');

// Class to represent the authentication service
class AuthService {
	constructor() {
		this.user = new User();
	}

	// Method to register a new user
	register = async (data) => {
		const { name, email, password } = data;

		try {
			// Input validation
			if (!name || !email || !password) {
				throw new CustomError('Name, email, and password are required', 400);
			}

			// Email format validation
			const emailRegex = /^\S+@\S+\.\S+$/;
			if (!emailRegex.test(email)) {
				throw new CustomError('Invalid email format', 400);
			}

			// Password length validation
			if (password.length < 8) {
				throw new CustomError('Password must be at least 8 characters', 400);
			}

			// Check if user already exists
			const existingUser = await this.user.findUserByEmail(email);
			if (existingUser) {
				throw new CustomError('User already exists', 400);
			}

			// Sanitize and normalize inputs
			const sanitizedEmail = email.trim().toLowerCase();
			const sanitizedName = name.trim();

			// Hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			// Create user
			const newUser = await this.user.createUser({
				name: sanitizedName,
				email: sanitizedEmail,
				password: hashedPassword,
			});

			const token = this.generateToken(newUser);
			delete newUser.password;
			return { newUser, token };
		} catch (error) {
			if (error instanceof CustomError) throw error;
			throw new Error('Registration failed');
		}
	};

	// Method to login a user

	login = async (data) => {
		const { email, password } = data;
		try {
			const user = await this.user.findUserByEmail(email);

			// Check if user exists
			if (!user) {
				throw new CustomError('User not found', 404);
			}

			// Check if password matches
			const passwordMatch = await bcrypt.compare(password, user.password);
			if (!passwordMatch) {
				throw new CustomError('Invalid credentials', 401);
			}

			const token = this.generateToken(user);
			delete user.password;
			return { user, token };
		} catch (error) {
			if (error instanceof CustomError) throw error;
			throw new Error('Login failed');
		}
	};

	// Method to generate a JWT token
	generateToken = (user) => {
		const token = jwt.sign(
			{
				id: user.id,
				name: user.name,
				email: user.email,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRATION,
			}
		);

		return token;
	};
}

module.exports = AuthService;
