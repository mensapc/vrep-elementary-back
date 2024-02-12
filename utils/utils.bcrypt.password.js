const bcrypt = require('bcryptjs');
const CustomError = require('./CustomError');

class BcryptPassword {
	// compare password
	PasswordCompare = async (requestPassword, savedPassword) => {
		if (!savedPassword || !requestPassword) throw new CustomError('Invalid credentials', 401);
		const passwordMatch = await bcrypt.compare(requestPassword, savedPassword);
		if (!passwordMatch) {
			throw new CustomError('Invalid credentials', 401);
		}
		return passwordMatch;
	};

	// generate password
	HashPassword = async (password) => {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		return hashedPassword;
	};
}

module.exports = BcryptPassword;
