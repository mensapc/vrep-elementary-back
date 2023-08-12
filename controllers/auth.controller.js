const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const Staff = require('../models/staff');
const Student = require('../models/student');
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const generateRegNumber = require('../utils/utils.registration_number');

class AuthController {
  constructor() {
    this.admin = new Admin();
    this.staff = new Staff();
    this.student = new Student();
  }

  register = async (req, res, next) => {
    const userType = req.params.userType;
    const userData = req.body;

    let newUser;

    try {
      await this.validateRegisterData(userData);
      const { email, password, role } = this.prepareRegistrationData(userData);
      switch (userType) {
        case 'admin':
          newUser = await this.admin.createAdmin({ ...userData, email, password, role });
          break;
        case 'staff':
          newUser = await this.staff.createStaff({ ...userData, email, password, role });
          break;
        case 'student':
          const regNumber = generateRegNumber();
          newUser = await this.student.createStudent({
            ...userData,
            reg_number: regNumber,
            email,
            password,
            role,
          });
          break;
        default:
          throw new CustomError(`Route: register/${userType} not found`, 404);
      }

      delete newUser.password;
      const token = generateToken(newUser);
      res.status(200).json({ user: newUser, token });
    } catch (error) {
      console.error(`Error registering ${userType}: ${error}`);
      next(error);
    }
  };

  validateRegisterData = async (data) => {
    const { email, password, role, first_name, last_name } = data;
    try {
      if (!email || !password || !role || !first_name || !last_name) {
        throw new CustomError('Name, email, role, and password are required', 400);
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
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new Error('Registration failed');
    }
  };

  prepareRegistrationData = (data) => {
    // Sanitize and normalize inputs
    const { email, password, role } = data;
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedRole = role.trim().toLowerCase();

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return {
      email: sanitizedEmail,
      password: hashedPassword,
      role: sanitizedRole,
    };
  };
}

module.exports = AuthController;
