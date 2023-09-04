const Class = require('../models/class');
const Staff = require('../models/staff'); // Import the Staff model;
const CustomError = require('../utils/CustomError');

class ClassController {
    constructor() {
        this.class = new Class();
        this.staff = new Staff(); // Create an instance of the Staff model
    }

    // Controller function to create a new class and reference staff_id
    createClassAndReferenceStaff = async (req, res, next) => {
        try {
            const classData = req.body; // Class data from request body
            const staffID = classData.staff_id; // Get staff_id from class data

            // Ensure staff with provided staff_id exists
            const staffExists = await this.staff.getStaffById(staffID);
            if (!staffExists) {
                throw new CustomError('Staff with the provided staff_id not found.', 404);
            }

            // Create the class and reference the staff_id
            const createdClass = await this.class.createClass(classData, staffID);

            const response = {
                class: {
                    description: createdClass.description,
                    class_name: createdClass.class_name,
                    classID: createdClass.classID
                },
                staff: {
                    staff_id: staffExists.staff_id,
                    last_name: staffExists.last_name,
                    first_name: staffExists.first_name,
                    age: staffExists.age,
                    email: staffExists.email
                }
            };
            res.status(201).json(response);
        } catch (error) {
            console.error(`Error creating class and referencing staff: ${error}`);
            next(error);
        }
    };

    // get all classes
    getAllClasses = async (req, res, next) => {
        try {
            const classes = await this.class.getAllClasses();
            res.status(200).json(classes);
        } catch (error) {
            console.error('Error getting all classes:', error);
            throw new CustomError('Classes not found.', 404);
        }
    };

    // Get single class
    getSingleClass = async (req, res, next) => {
        const classID = req.params.classID;
        try {
            const classData = await this.class.getClassById(classID);
            res.status(200).json({ class: classData, });
        } catch (error) {
            console.error(`Error CourseID number ${classID}: ${error}`);
            next(error);
        }
    };


    // Delete class by ID
    deleteClassByID = async (req, res, next) => {
        try {
            const classID = req.params.classID;


            if (!classID) {
                throw new CustomError(`Route: not able to get /${classID}`, 400);
            }

            const deletedClass = await this.class.deleteClass(classID);

            res.status(204).json({ deletedClass: 'class has been terminated' })

        } catch (error) {
            console.error(`Error deleting student with registration number ${req.body.classID}: ${error}`);
            next(error);
        }
    };

    updateClassByID = async (req, res, next) => {
        try {
            const classID = req.params.classID; // Get the class ID from the request params
            const updatedData = req.body; // Updated data from the request body

            const updatedClass = await this.class.updateClass(classID, updatedData);

            if (!updatedClass) {
                throw new CustomError('Class not found.', 404);
            }

            res.status(200).json(updatedClass);
        } catch (error) {
            console.error(`Error updating class: ${error}`);
            next(error);
        }
    };



}

module.exports = ClassController;
