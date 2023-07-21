const User = require('../models/user');
const Teacher = require('../models/teacher');
const CustomError = require('../../utils/CustomError');

class TeacherController {
    constructor() {
        this.user = new User();
        this.teacher = new Teacher();
    }

    // Method to create a new teacher
    createTeacher = async(req, res, next) => {
        const data = req.body;
        try {

            // Validate if user exists
            const isUserExist = await this.user.findUserById(data.user_id);
            if (!isUserExist) throw new CustomError('User is not exist', 401);

            // Create teacher
            const result = await this.teacher.createTeacher(data);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error creating teacher:', error);
            next(error);
        }
    }

    // Method to get all teachers
    getAllTeachers = async(req, res, next) => {
        try {
            const result = await this.teacher.getAllTeachers();
            res.status(200).json({ teachers: result });
        } catch (error) {
            console.error('Error getting all teachers:', error);
            next(error);
        }
    }

    // Method to get teacher by id
    getTeacherById = async(req, res, next) => {
        const { id } = req.params;
        try {
            const result = await this.teacher.getTeacherById(id);
            res.status(200).json({ teacher: {...result } });
        } catch (error) {
            console.error('Error getting teacher by id:', error);
            next(error);
        }
    }

    // Method to update teacher by id
    updateTeacherById = async(req, res, next) => {
        const { id } = req.params;
        const data = req.body;

        try {
            if (data.user_id) throw new CustomError('User id cannot be updated', 400);
            const result = await this.teacher.updateTeacherById(id, data);
            res.status(200).json({ teacher: {...result } });
        } catch (error) {
            console.error('Error updating teacher by id:', error);
            next(error);
        }
    }


}

module.exports = TeacherController;