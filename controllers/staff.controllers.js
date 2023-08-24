const Staff = require('../models/staff');
const CustomError = require('../utils/CustomError.js');
const RegistrationUtils = require('../utils/utils.addStudent');
const generateRegNumber = require('../utils/utils.registration_number');
const generateToken = require('../utils/utils.token')


class StaffController {
    constructor() {
        this.staff = new Staff()
    }
    findAllStaff = async (req, res, next) => {
        try {
            const staff = await this.staff.getAllStaff();

            if (staff.length === 0) {
                return res.status(404).json({ message: 'No students found .' })
            }
            res.status(200).json({ Allstaff: staff })
        } catch (error) {
            console.error(`Error retrieving all students `, error);
            next(error);
        }
    };

    getStaffById = async (req, res, next) => {
        const staffId = req.body.staff_id; // Use staff_id from req.body

        try {
            const staff = await this.staff.getStaffById(staffId);
            res.status(200).json(staff);
        } catch (error) {
            console.error('Error in getStaffById controller:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
    deleteStaffById = async (req, res, next) => {
        const staffId = req.body.staff_id; // Extract staff ID from req.body

        try {
            await this.staff.deleteStaffById(staffId);
            res.status(204).send(); // Successful deletion, no content to send
        } catch (error) {
            console.error('Error in deleteStaffById controller:', error);
            res.status(error.statusCode || 500).json({ error: error.message });
        }
    }


}



module.exports = StaffController;