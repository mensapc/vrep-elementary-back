const pool = require('../../config/db');

// Class to represent a student

class Student {
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
            const query = `SELECT u.name, u.email, s.* FROM users u JOIN students s ON u.id = s.user_id`;
            const result = await pool.query(query);
            return result.rows;

        } catch (error) {
            console.error('Error getting all students:', error);
            next(error);
        }
    }
}

module.exports = Student;