const Staff = require('../models/staff');
const CustomError = require('../utils/CustomError.js');
const RegistrationUtils = require('../utils/utils.addStudent');


class StaffController {
    constructor() {
        this.staff = new Staff()
    }
    //get all staff 
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
    // get satff by id 
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
    // deleting staff by id 
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
    // updating staff details by id
    updateStaffById = async (req, res, next) => {
        try {
            const { staff_id } = req.body;
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
            console.error(`Error updating staff with ID ${req.body.staff_id}: ${error}`);
            throw new Error('Failed to update staff.');
        }
    }


}



module.exports = StaffController;