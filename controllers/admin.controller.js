const Admin = require('../models/admin');
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const BcryptPassword = require('../utils/utils.bcrypt.password');
const registrationUtils = require('../utils/utils.registration');
const { uploadImage } = require('../services/cloudinary');
const { createActivity } = require('./activity.controller');
const { sendMal } = require('../utils/utils.mailer');
const {
  generateRandomPassword,
  validatePassword,
} = require('../utils/utils.password');

class AdminController {
  constructor() {
    this.bcryptPassword = new BcryptPassword();
    this.registrationUtils = new registrationUtils();
  }

  register = async (req, res, next) => {
    const userData = req.body;

    try {
      this.registrationUtils.validateData(userData, 'admin');
      const admin = await Admin.findOne({ email: userData.email });
      if (admin) throw new CustomError('Admin already exists', 400);

      if (req.file?.path) {
        const url = await uploadImage(req.file.path);
        userData.photo = url;
      }

      const hashedPassword = await this.bcryptPassword.HashPassword(
        userData.password
      );

      const newAdmin = await Admin.create({
        ...userData,
        password: hashedPassword,
      });
      delete newAdmin._doc.password;

      const token = generateToken({
        id: newAdmin._id,
        email: newAdmin.email,
        first_name: newAdmin.first_name,
        last_name: newAdmin.last_name,
        role: newAdmin.role,
      });

      createActivity(
        `New Admin ${newAdmin.first_name} ${newAdmin.last_name} registered successfully`
      );

      res.status(200).json({ ...newAdmin._doc, token });
    } catch (error) {
      console.error(`Error registering admin: ${error}`);
      next(error);
    }
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const admin = await Admin.findOne({ email });
      if (!admin) throw new CustomError('Invalid credentials', 404);
      const comparedPassword = await this.bcryptPassword.PasswordCompare(
        password,
        admin.password
      );
      if (!comparedPassword) throw new CustomError('Invalid credentials', 400);
      delete admin._doc.password;

      const token = generateToken({
        id: admin._id,
        email: admin.email,
        first_name: admin.first_name,
        last_name: admin.last_name,
        role: admin.role,
      });
      res.status(200).json({ ...admin._doc, token });
    } catch (error) {
      console.error('Error logging in admin:', error);
      next(error);
    }
  };

  forgetPassowrd = async (req, res, next) => {
    const { email } = req.body;

    try {
      const admin = await Admin.findOne({ email });
      if (!admin) throw new CustomError('Account does not exist', 404);

      const tempPassword = generateRandomPassword(8);
      const hashedPassword = await this.bcryptPassword.HashPassword(
        tempPassword
      );

      admin.password = hashedPassword;

      const mailDetails = {
        to: email,
        subject: 'Forgot Password',
        htmlText: `<p>This is a temporary passoword. Please login with passowrd: <strong>${tempPassword}</strong>. Don't forget to update this password after successful login.</p>`,
      };
      const { error } = await sendMal(mailDetails);

      if (error) throw new CustomError('Error sending mail', 400);

      await admin.save();

      res.status(200).json({
        status: true,
        message:
          'Success!!!. Please follow directives of mail sent to your email address',
      });
    } catch (error) {
      next(error);
    }
  };

  updatePassword = async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    try {
      validatePassword({ currentPassword, newPassword });

      const adminUser = await Admin.findById(req.user?.id);

      await this.bcryptPassword.PasswordCompare(
        currentPassword,
        adminUser.password
      );

      const hashedPassword = await this.bcryptPassword.HashPassword(
        newPassword
      );

      adminUser.password = hashedPassword;
      await adminUser.save();

      return res.status(200).json({
        status: true,
        message: 'Password successfully updated',
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AdminController;
