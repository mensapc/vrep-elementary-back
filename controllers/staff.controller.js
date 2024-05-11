const Staff = require('../models/staff');
const HeadTeacher = require("../models/headteacher")
const Course = require('../models/course')
const Class = require('../models/class')
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const PreRegistrationModel = require('../models/pregistration')
const BcryptPassword = require('../utils/utils.bcrypt.password');
const registrationUtils = require('../utils/utils.registration');
const { uploadImage } = require('../services/cloudinary');
const { sortActions } = require('../utils/utils.common');
const { createActivity } = require('./activity.controller');
const { generateTimetable } = require('../utils/utils.timetable');

class StaffController {
  constructor() {
    this.bcryptPassword = new BcryptPassword();
    this.registrationUtils = new registrationUtils();
  }

  register = async (req, res, next) => {
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
  
      this.registrationUtils.validateData(userData, 'staff');
      const staffExists = await Staff.findOne({ email: userData.email });
      if (staffExists) {
        throw new CustomError('Staff already exists', 400);
      }
  
      const className = userData.className; // Assuming class name is passed in userData
      const assignedClass = await Class.findOne({ name: className });
      if (!assignedClass) {
        throw new CustomError("Class not found", 404);
      }
  
      const hashedPassword = await this.bcryptPassword.HashPassword(userData.password);
  
      if (req.file?.path) {
        const url = await uploadImage(req.file.path);
        userData.photo = url;
      }
  
      const newStaff = await Staff.create({ ...userData, password: hashedPassword });
      delete newStaff._doc.password;
  
      // Add the staff to the class
      await Class.findByIdAndUpdate(
        assignedClass._id,
        { $push: { staff: newStaff._id } },
        { new: true }
      ).populate('staff');
  
      const authToken = generateToken({
        id: newStaff._id,
        email: newStaff.email,
        first_name: newStaff.first_name,
        last_name: newStaff.last_name,
        role: newStaff.role,
      });
  
      // await generateTimetable(newStaff._id);
  
      res.status(201).json({ ...newStaff._doc, authToken });
    } catch (error) {
      console.error(`Error registering staff: ${error}`);
      next(error);
    }
  };
  
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
        throw new CustomError('Staff already exists', 400);
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
  };

  login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const staff = await Staff.findOne({ email });
      if (!staff) throw new CustomError('Invalid credentials', 404);
      const comparedPassword = await this.bcryptPassword.PasswordCompare(password, staff.password);
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
      if (!deletedStaff) throw new CustomError('Staff not found', 404);

      await updateClassStaff(deletedStaff._class, null);
      await createActivity(
        `Teacher ${deletedStaff.first_name} ${deletedStaff.last_name} deleted by ${req.user.first_name} ${req.user.last_name}`
      );
      res.status(204).json({ message: 'Staff deleted successfully' });
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

      const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, data, { new: true })
      .select('-_id');
      await createActivity(
        `Teacher ${updatedStaff.first_name} ${updatedStaff.last_name} details updated by ${req.user.first_name} ${req.user.last_name}`
      );
      res.status(201).json(updatedStaff);
    } catch (error) {
      console.error(`Error updating staff: ${error}`);
      next(error);
    }
  };

  addStaffToCourse = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { first_name , last_name} = req.body;

      // Check if the student exists
      const isStaff = await Staff.findOne({ first_name, last_name });
      if (!isStaff) {
        throw new CustomError("Staff not found", 404);
      }

      // Check if the staff is already assigned to a course
      const course = await Course.findById(id);

      
      if (!course) {
        throw new CustomError("Course not found", 404);
      }

      // Add the staff to the course
      const newStaffToCourse = await Course.findByIdAndUpdate(
        course,
        { $push: { staff: isStaff._id} },
        { new: true }
      ).populate('staff');
      
      await newStaffToCourse.save();

      res.status(200).json(newStaffToCourse);
    } catch (error) {
      console.error(`Error adding student to course: ${error}`);
      next(error);
    }
  }

  addStaffToClass = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { first_name} = req.body;

      // Check if the student exists
      const isStaff = await Staff.findOne({ first_name});
      if (!isStaff) {
        throw new CustomError("Staff not found", 404);
      }

      // Check if the staff is already assigned to a class
      const assignedStaff = await Class.findById(id)
      if (!assignedStaff) {
        throw new CustomError("Course not found", 404);
      }

      // Add the staff to the course
      const newStaffToClass = await Class.findByIdAndUpdate(
        assignedStaff,
        { $push: { staff: isStaff._id ,} },
        { new: true }
      ).populate('staff');
      
      await newStaffToClass.save();

      res.status(200).json(newStaffToClass);
    } catch (error) {
      console.error(`Error adding student to course: ${error}`);
      next(error);
    }
  }
}

module.exports = StaffController;

