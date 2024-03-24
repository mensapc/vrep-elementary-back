const BcryptPassword = require('../utils/utils.bcrypt.password');
const CustomError = require('./CustomError');

class RegistrationUtils {
  constructor() {
    this.bcryptPassword = new BcryptPassword();
  }
  validateData = (data, userType) => {
    const { email, password, first_name, last_name, } = data;
    try {
      if (!first_name || !last_name) {
        throw new CustomError('First name, last name, and are required', 400);
      }

      if (userType === 'staff' || userType === 'admin') {
        if (!password || !email) {
          throw new CustomError('Email, and Password is required', 400);
        }

        if (password.length < 8) {
          throw new CustomError('Password must be at least 8 characters', 400);
        }

        // Email format validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
          throw new CustomError('Invalid email format', 400);
        }
      }

      if (first_name.length < 3 || last_name.length < 3) {
        throw new CustomError('firt name or last name should be at least 3 characters');
      }
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new Error(`Registration failed:${error}`);
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
