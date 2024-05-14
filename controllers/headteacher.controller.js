const HeadTeacher = require("../models/headteacher")
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const PreRegistrationModel = require('../models/pregistration')
const BcryptPassword = require('../utils/utils.bcrypt.password');
const registrationUtils = require('../utils/utils.registration');


class HeadController {
  constructor() {
    this.bcryptPassword = new BcryptPassword();
    this.registrationUtils = new registrationUtils();
  }
  registerHeadTeacher = async (req, res, next) => {
    const userData = req.body;
    const { token } = req.params;
  
    try {
      const preRegistration = await PreRegistrationModel.findOne({ tokens: token });
      if (!preRegistration || preRegistration.expires < new Date()) {
        throw new CustomError('Invalid or expired token', 400);
      }
  
      const verifyEmail = await PreRegistrationModel.findOne({ email: userData.email });
      if (userData.email !== verifyEmail.email) {
        throw new CustomError('Email does not match invitation', 400);
      }
  
      this.registrationUtils.validateData(userData, 'headTeacher');
      const staffExists = await HeadTeacher.findOne({ email: userData.email });
      if (staffExists) {
        throw new CustomError('Head Teacher already exists', 400);
      }
  
      const hashedPassword = await this.bcryptPassword.HashPassword(userData.password);
  
      if (req.file?.path) {
        const url = await uploadImage(req.file.path);
        userData.photo = url;
      }
  
      const newHeadTeacher = await HeadTeacher.create({ ...userData, password: hashedPassword });
      delete newHeadTeacher._doc.password;
  
      const authToken = generateToken({
        id: newHeadTeacher._id,
        email: newHeadTeacher.email,
        first_name: newHeadTeacher.first_name,
        last_name: newHeadTeacher.last_name,
        role: newHeadTeacher.role,
      });

      res.status(201).json({ ...newHeadTeacher._doc, authToken });
    } catch (error) {
      console.error(`Error registering Head teacher: ${error}`);
      next(error);
    }
  };

  loginAsHeadteacher = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const newHeadTeacher = await HeadTeacher.findOne({ email });
      if (!staff) throw new CustomError('Invalid credentials', 404);
      const comparedPassword = await this.bcryptPassword.PasswordCompare(password, newHeadTeacher.password);
      if (!comparedPassword) throw new CustomError('Invalid credentials', 400);
      delete newHeadTeacher._doc.password;

      const token = generateToken({
        id: newHeadTeacher._id,
        email: newHeadTeacher.email,
        first_name: newHeadTeacher.first_name,
        last_name: newHeadTeacher.last_name,
        role: newHeadTeacher.role,
      });
      res.status(200).json({ ...newHeadTeacher._doc, token });
    } catch (error) {
      console.error('Error logging in Head teacher:', error);
      next(error);
    }
  }
}

module.exports = HeadController;