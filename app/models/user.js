const pool = require('../../config/db');

// Class to represent a user
class User {
	// Method to create a new user
	createUser = async (userData) => {
		const { name, email, password } = userData;

		try {
			const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *';
			const values = [name, email, password];

			const result = await pool.query(query, values);
			return result.rows[0];
		} catch (error) {
			console.error('Error creating user:', error);
			throw new Error('Failed to create user.');
		}
	};

	// Method to find a user by email
	findUserByEmail = async (email) => {
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
}

module.exports = User;
