const Staff = require('../models/staff');
const CustomError = require('../utils/CustomError');
const generateToken = require('../utils/utils.token');
const BcryptPassword = require('../utils/utils.bcrypt.password');
const registrationUtils = require('../utils/utils.registration');

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
			const staff = await Staff.find();
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
			const staff = await Staff.findOne({ _id: id });
			if (!staff) throw new CustomError('Staff not found', 404);
			res.status(200).json(staff);
		} catch (error) {
			console.error('Fail to retrieve Staff:', error);
			next(error);
		}
	};

	// deleting staff by id
	deleteStaffById = async (req, res, next) => {
		const staff_id = req.params.staff_id; // Extract staff ID from req.body
		try {
			await this.staff.deleteStaffById(staff_id);
			res.status(204).send(); // Successful deletion, no content to send
		} catch (error) {
			console.error('Error in deleteStaffById controller:', error);
			res.status(error.statusCode || 500).json({ error: error.message });
		}
	};
	// updating staff details by id
	updateStaffById = async (req, res, next) => {
		try {
			const staff_id = req.params.staff_id;
			const updatedData = req.body; // Assuming you send the entire updated data in the request body

			if (!staff_id) {
				throw new CustomError('Staff ID is required', 400);
			}

			const updatedStaff = await this.staff.updateStaffById(staff_id, updatedData);

			if (updatedStaff) {
				res.status(201).json({ staff: updatedStaff });
			} else {
				throw new CustomError(`Staff with ID ${staff_id} not found`, 400);
			}
		} catch (error) {
			console.error(`Error updating staff with ID ${req.params.staff_id}: ${error}`);
			throw new Error('Failed to update staff.');
		}
	};
}

module.exports = StaffController;

