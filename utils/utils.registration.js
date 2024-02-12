const BcryptPassword = require('../utils/utils.bcrypt.password');
const CustomError = require('./CustomError');

class RegistrationUtils {
	constructor() {
		this.bcryptPassword = new BcryptPassword();
	}
	validateData = (data, userType) => {
		const { email, password, role, first_name, last_name, age } = data;
		try {
			if (!email || !password || !role || !first_name || !last_name || !age) {
				throw new CustomError(
					'First name, last name, age, email, role, and password are required',
					400
				);
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

			if (first_name.length < 3 || last_name.length < 3) {
				throw new CustomError('firt name or last name should be at least 3 characters');
			}

			if ((userType === 'staff' || userType === 'admin') && age < 18) {
				throw new CustomError('User must be older than 18');
			}

			if (user.role !== 'admin' || user.role !== 'staff' || user.role !== 'pupil') {
				throw new CustomError('Invalid role', 400);
			}
		} catch (error) {
			if (error instanceof CustomError) throw error;
			throw new Error('Registration failed');
		}
	};

	prepareData = async (data) => {
		// Sanitize and normalize inputs
		const { email, password, role } = data;
		const sanitizedEmail = email.trim().toLowerCase();
		const sanitizedRole = role.trim().toLowerCase();

		// Hash password
		const hashedPassword = await this.bcryptPassword.HashPassword(password);

		return {
			email: sanitizedEmail,
			password: hashedPassword,
			role: sanitizedRole,
		};
	};
}

module.exports = RegistrationUtils;
