const pool = require('../../config/db');
const UtilsQueries = require('../../utils/utils.queries');

// Class to represent a student

class Student {
    constructor() {
        this.utilsQueries = new UtilsQueries();
    }
    createStudent = async(studentData) => {
        const { user_id, grade_level, contact_number, address = null } = studentData;
        try {
            const query = 'INSERT INTO students (user_id, grade_level, contact_number, address) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [user_id, grade_level, contact_number, address];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating student:', error);
            throw new Error('Failed to create student.');
        }
    }

    getAllStudents = async() => {
        try {
            const query = `SELECT u.name, u.email, role, s.* FROM users u JOIN students s ON u.id = s.user_id`;
            const result = await pool.query(query);
            return result.rows;

        } catch (error) {
            console.error('Error getting all students:', error);
            next(error);
        }
    }

    getStudentById = async(student_id) => {
        try {
            const query = `SELECT u.name, u.email, s.* FROM users u JOIN students s ON u.id = s.user_id WHERE s.id = $1`;
            const values = [student_id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error getting student by id:', error);
            next(error);
        }
    }

    updateStudentById = async(student_id, studentData) => {
        try {
            const { queryParams, setClauseString } = this.utilsQueries.filterUpdates(studentData);
            const query = `UPDATE students SET ${setClauseString} WHERE id = $${queryParams.length + 1} RETURNING *`;
            const values = [...queryParams, student_id];
            const result = await pool.query(query, values);
            return this.getStudentById(result.rows[0].id);
        } catch (error) {
            console.error('Error updating student by id:', error);
            next(error);
        }
    }
}

module.exports = Student;