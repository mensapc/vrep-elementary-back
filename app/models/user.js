const pool = require('../../config/db');

// Class to represent a user
class User {
    // Method to create a new user
    createUser = async(userData) => {
        const { name, email, password, role } = userData;

        try {
            const query =
                'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
            const values = [name, email, password, role];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user.');
        }
    };

    // Method to find a user by email
    findUserByEmail = async(email) => {
        try {
            const query = 'SELECT * FROM users WHERE email = $1';
            const values = [email];

            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('Failed to find user.');
        }
    };

    // Method to find a user by id
    findUserById = async(id) => {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const values = [id];
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error finding user by id:', error);
            throw new Error('Failed to find user.');
        }
    }
}

module.exports = User;