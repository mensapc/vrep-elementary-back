const Admin = require('../models/admin');
const CustomError = require('../utils/CustomError');
const { sendRegistrationEmail , validateEmail } = require('../utils/utils.mailer');
const generateToken = require('../utils/utils.token');
const { updateClassStaff } = require('../utils/utils.class');
const crypto = require('crypto');
const PreRegistrationModel = require('../models/pregistration')

const BcryptPassword = require('../utils/utils.bcrypt.password');
const registrationUtils = require('../utils/utils.registration');
const { uploadImage } = require('../services/cloudinary');
const { createActivity } = require('./activity.controller');


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

      const hashedPassword = await this.bcryptPassword.HashPassword(userData.password);

      const newAdmin = await Admin.create({ ...userData, password: hashedPassword });
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
      const comparedPassword = await this.bcryptPassword.PasswordCompare(password, admin.password);
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

regLinkForStaff = async (req, res, next) => {
    try {
      const { email }  = req.body;

      const check = validateEmail(email)

      if(check){
        console.log("Proceeding to send email with token and save to database");
      }
        const  preToken = {
          token : crypto.randomBytes(32).toString('hex'),
          expires : new Date(Date.now() + 24 * 3600 * 1000)
        }
  
      const create =  await PreRegistrationModel.create({
        email, 
        token: preToken.token ,
        expires :preToken.expires
      })
      await create.save()

      await sendRegistrationEmail(email , create.token);

      if(!sendRegistrationEmail){
        throw new CustomError("Unable to create and send staff email", 550);
      } else {
        res.status(200).json({ message: 'Teacher created and email sent.'});
      }
    } catch (error) {
      console.error(`Error sending registration link to staff : ${error}`);
      next(error);
    }
  }

}

module.exports = AdminController;
