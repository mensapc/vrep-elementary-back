const pool = require('../../config/db');
const UtilsQueries = require('../../utils/utils.queries');

// Class to represent a teacher

class Teacher {
    constructor() {
        this.utilsQueries = new UtilsQueries();
    }
    createTeacher = async(teacherData) => {
        const { user_id, contact_number, address } = teacherData;
        try {
            const query = 'INSERT INTO teachers (user_id, contact_number, address) VALUES ($1, $2, $3) RETURNING *';
            const values = [user_id, contact_number, address];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating teacher:', error);
            throw new Error('Failed to create teacher.');
        }
    }

    getAllTeachers = async() => {
        try {
            const query = `SELECT u.name, u.email, u.role, t.* FROM users u JOIN teachers t ON u.id = t.user_id`;
            const result = await pool.query(query);
            return result.rows;

        } catch (error) {
            console.error('Error getting all teachers:', error);
            throw new Error("Failed to get teachers' list.");
        }
    }

    getTeacherById = async(teacher_id) => {
        try {
            const query = `SELECT u.name, u.email, u.role, t.* FROM users u JOIN teachers t ON u.id = t.user_id WHERE t.id = $1`;
            const values = [teacher_id];
            const result = await pool.query(query, values);
            console.log(result.rows, 'result.....')
            return result.rows[0];
        } catch (error) {
            console.error('Error getting teacher by id:', error);
            throw new Error('Failed to get teacher info');
        }
    }

    updateTeacherById = async(teacher_id, teacherData) => {
        try {
            const { queryParams, setClauseString } = this.utilsQueries.filterUpdates(teacherData);
            const query = `UPDATE teachers SET ${setClauseString} WHERE id = $${queryParams.length + 1} RETURNING *`;
            const values = [...queryParams, teacher_id];
            const result = await pool.query(query, values);
            return this.getTeacherById(result.rows[0].id);
        } catch (error) {
            console.error('Error updating teacher by id:', error);
            throw new Error('Failed to update teacher info');
        }
    }
}

module.exports = Teacher;