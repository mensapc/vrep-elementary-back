const Admin = require('../models/admin');
const User = require('../models/user');
const Staff = require('../models/staff');
const Class = require('../models/class');
const Student = require('../models/student');
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const generateRegNumber = require('../utils/utils.registration_number');
const BcryptPassword = require('../utils/utils.bcrypt.password');
const RegistrationUtils = require('../utils/utils.registration');

class AuthController {
  constructor() {
    this.user = new User();
    this.admin = new Admin();
    this.staff = new Staff();
    this.student = new Student();
    this.bcryptPassword = new BcryptPassword();
    this.registrationUtils = new RegistrationUtils();
  }

  register = async (req, res, next) => {
    const userType = req.params.userType;
    const userData = req.body;

    let newUser;

    try {
      this.registrationUtils.validateData(userData, userType);
      const { email, password, role } = await this.registrationUtils.prepareData(userData);
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

  login = async (req, res, next) => {
    const userType = req.params.userType;
    const userData = req.body;

    try {
      let credentials, userInfo, token;

      switch (userType) {
        case 'student':
          credentials = await this.user.findUserByRegNumber(userData.reg_number);
          userInfo = await this.student.findStudentByRegNumber(credentials.id);
          break;

        case 'staff':
        case 'admin':
          credentials = await this.user.findUserByEmail(userData.email);
          userInfo =
            userType === 'staff'
              ? await this.staff.findStaffByEmail(credentials.email)
              : await this.admin.findAdminByEmail(credentials.email);

          await this.bcryptPassword.PasswordCompare(userData.password, userInfo.password);

          break;

        default:
          throw new CustomError(`Route: login/${userType} not found`, 404);
      }

      if (!credentials || !userInfo) {
        throw new CustomError(`${userType} not found`, 404);
      }

      delete userInfo.password;
      token = generateToken(userInfo);

      res.status(200).json({ user: userInfo, token });
    } catch (error) {
      console.error('Error logging in user:', error);
      next(error);
    }
  };
}

module.exports = AuthController;
