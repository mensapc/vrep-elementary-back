const Staff = require('../models/staff');
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const BcryptPassword = require('../utils/utils.bcrypt.password');
const registrationUtils = require('../utils/utils.registration');
const { uploadImage } = require('../services/cloudinary');
const { sortActions } = require('../utils/utils.common');
const { createActivity } = require('./activity.controller');
const {
  generateRandomPassword,
  validatePassword,
} = require('../utils/utils.password');
const { sendMail } = require('../utils/utils.mailer');

class StaffController {
  constructor() {
    this.bcryptPassword = new BcryptPassword();
    this.registrationUtils = new registrationUtils();
  }

  register = async (req, res, next) => {
    const userData = req.body;

    try {
      this.registrationUtils.validateData(userData, 'staff');
      const staff = await Staff.findOne({ email: userData.email });
      if (staff) throw new CustomError('staff already exists', 400);
      const hashedPassword = await this.bcryptPassword.HashPassword(
        userData.password
      );

      if (req.file?.path) {
        const url = await uploadImage(req.file.path);
        userData.photo = url;
      }

      const newStaff = await Staff.create({
        ...userData,
        password: hashedPassword,
      });
      delete newStaff._doc.password;

      const token = generateToken({
        id: newStaff._id,
        email: newStaff.email,
        first_name: newStaff.first_name,
        last_name: newStaff.last_name,
        role: newStaff.role,
      });
      await createActivity(
        `New Teacher ${newStaff.first_name} ${newStaff.last_name} registered by ${req.user.first_name} ${req.user.last_name}`
      );

      res.status(200).json({ ...newStaff._doc, token });
    } catch (error) {
      console.error(`Error registering staff: ${error}`);
      next(error);
    }
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const staff = await Staff.findOne({ email });
      if (!staff) throw new CustomError('Invalid credentials', 404);
      const comparedPassword = await this.bcryptPassword.PasswordCompare(
        password,
        staff.password
      );
      if (!comparedPassword) throw new CustomError('Invalid credentials', 400);
      delete staff._doc.password;

      const token = generateToken({
        id: staff._id,
        email: staff.email,
        first_name: staff.first_name,
        last_name: staff.last_name,
        role: staff.role,
      });
      res.status(200).json({ ...staff._doc, token });
    } catch (error) {
      console.error('Error logging in staff:', error);
      next(error);
    }
  };

  //get all staff
  getAll = async (req, res, next) => {
    try {
      const staff = await Staff.find()
        .populate({ path: '_class', select: 'name' })
        .select('-password');
      res.status(200).json(staff);
    } catch (error) {
      console.error(`Error retrieving all staff `, error);
      next(error);
    }
  };

  // Get staff by id
  getById = async (req, res, next) => {
    const { id } = req.params;
    try {
      const staff = await Staff.findOne({ _id: id }).select('-password');
      if (!staff) throw new CustomError('Staff not found', 404);
      res.status(200).json(staff);
    } catch (error) {
      console.error('Fail to retrieve Staff:', error);
      next(error);
    }
  };

  // get staff by sort
  staffBySort = async (req, res, next) => {
    const { sortby } = req.query;
    const sortAction = sortActions(sortby);

    try {
      const staff = await Staff.find()
        .populate({ path: '_class', select: 'name' })
        .select('-password')
        .sort(sortAction);
      res.status(200).json(staff);
    } catch (error) {
      console.error(`Error retrieving sorted staff `, error);
      next(error);
    }
  };

  // deleting staff by id
  deleteStaff = async (req, res, next) => {
    const { id } = req.params;
    try {
      const deletedStaff = await Staff.findByIdAndDelete({ _id: id });
      await createActivity(
        `Teacher ${deletedStaff.first_name} ${deletedStaff.last_name} deleted by ${req.user.first_name} ${req.user.last_name}`
      );
      res.status(200).json({ message: 'Staff deleted successfully' });
    } catch (error) {
      console.error(`Error deleting Staff: ${error}`);
      next(error);
    }
  };

  // updating staff details by id
  updateStaff = async (req, res, next) => {
    try {
      const data = req.body;
      delete data.password;
      delete data._id;

      if (req.file?.path) {
        const url = await uploadImage(req.file.path);
        data.photo = url;
      }

      const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, data, {
        new: true,
      });
      await createActivity(
        `Teacher ${updatedStaff.first_name} ${updatedStaff.last_name} details updated by ${req.user.first_name} ${req.user.last_name}`
      );
      res.status(201).json(updatedStaff);
    } catch (error) {
      console.error(`Error updating staff: ${error}`);
      next(error);
    }
  };

  forgetPassowrd = async (req, res, next) => {
    const { email } = req.body;

    try {
      const staff = await Staff.findOne({ email });
      if (!staff) throw new CustomError('Account does not exist', 404);

      const tempPassword = generateRandomPassword(8);
      const hashedPassword = await this.bcryptPassword.HashPassword(
        tempPassword
      );

      staff.password = hashedPassword;

      const mailDetails = {
        to: email,
        subject: 'Forgot Password',
        htmlText: `<p>This is a temporary passoword. Please login with passowrd: <strong>${tempPassword}</strong>. Don't forget to update this password after successful login.</p>`,
      };
      const { error } = await sendMail(mailDetails);

      if (error) throw new CustomError('Error sending mail', 400);

      await staff.save();

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

      const staff = await Staff.findById(req.user?.id);

      await this.bcryptPassword.PasswordCompare(
        currentPassword,
        staff.password
      );

      const hashedPassword = await this.bcryptPassword.HashPassword(
        newPassword
      );

      staff.password = hashedPassword;
      await staff.save();

      return res.status(200).json({
        status: true,
        message: 'Password successfully updated',
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = StaffController;
