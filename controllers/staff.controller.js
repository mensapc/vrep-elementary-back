const Staff = require('../models/staff');
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const BcryptPassword = require('../utils/utils.bcrypt.password');
const registrationUtils = require('../utils/utils.registration');
const { uploadImage } = require('../services/cloudinary');
const { sortActions } = require('../utils/utils.common');

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
      const hashedPassword = await this.bcryptPassword.HashPassword(userData.password);

      if (req.file?.path) {
        const url = await uploadImage(req.file.path);
        userData.photo = url;
      }

      const newStaff = await Staff.create({ ...userData, password: hashedPassword });
      delete newStaff._doc.password;

      const token = generateToken({ id: newStaff._id, email: newStaff.email, role: newStaff.role });
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
      const comparedPassword = await this.bcryptPassword.PasswordCompare(password, staff.password);
      if (!comparedPassword) throw new CustomError('Invalid credentials', 400);
      delete staff._doc.password;

      const token = generateToken({ id: staff._id, email: staff.email, role: staff.role });
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
      await Staff.findByIdAndDelete({ _id: id });
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

      const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, data, { new: true });
      res.status(201).json(updatedStaff);
    } catch (error) {
      console.error(`Error updating staff: ${error}`);
      next(error);
    }
  };
}

module.exports = StaffController;

