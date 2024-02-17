const Admin = require('../models/admin');
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const BcryptPassword = require('../utils/utils.bcrypt.password');
const registrationUtils = require('../utils/utils.registration');
const { uploadImage } = require('../services/cloudinary');

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

      if (req.file.path) {
        const url = await uploadImage(req.file.path);
        userData.photo = url;
      }

      const hashedPassword = await this.bcryptPassword.HashPassword(userData.password);

      const newAdmin = await Admin.create({ ...userData, password: hashedPassword });
      delete newAdmin._doc.password;

      const token = generateToken({ id: newAdmin._id, email: newAdmin.email, role: newAdmin.role });
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
      const comparedPassword = await this.bcryptPassword.PasswordCompare(password, admin.password);
      if (!comparedPassword) throw new CustomError('Invalid credentials', 400);
      delete admin._doc.password;

      const token = generateToken({ id: admin._id, email: admin.email, role: admin.role });
      res.status(200).json({ ...admin._doc, token });
    } catch (error) {
      console.error('Error logging in admin:', error);
      next(error);
    }
  };
}

module.exports = AdminController;
