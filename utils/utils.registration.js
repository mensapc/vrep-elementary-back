const BcryptPassword = require('../utils/utils.bcrypt.password');
const CustomError = require('./CustomError');

class RegistrationUtils {
  constructor() {
    this.bcryptPassword = new BcryptPassword();
  }
  validateData = (data, userType) => {
    const { email, password, role, first_name, last_name, age } = data;
    try {
      if (!email || !role || !first_name || !last_name || !age) {
        throw new CustomError(
          'First name, last name, age, email, role, and password are required',
          400
        );
      }

      if (role !== 'admin' && role !== 'staff' && role !== 'pupil') {
        throw new CustomError('Invalid role', 400);
      }

      // Email format validation
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        throw new CustomError('Invalid email format', 400);
      }

      if (first_name.length < 3 || last_name.length < 3) {
        throw new CustomError('firt name or last name should be at least 3 characters');
      }

      if (userType === 'staff' || userType === 'admin') {
        if (!password) {
          throw new CustomError('Password is required', 400);
        }

        if (password.length < 8) {
          throw new CustomError('Password must be at least 8 characters', 400);
        }

        if (age < 18) {
          throw new CustomError('User must be older than 18', 400);
        }
      }

      if (userType === 'pupil') {
        const { _class, address, health_condition, parent_name, parent_phone } = data;
        if (!_class || !address || !health_condition || !parent_name || !parent_phone) {
          throw new CustomError(
            'Address, health condition, parent name, and parent phone are required',
            400
          );
        }
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
