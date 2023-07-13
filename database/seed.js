const bcrypt = require('bcryptjs');
const pool = require('../config/db');

class Seeder {
	seedData = async (tableName, data) => {
		const client = await pool.connect();
		try {
			await client.query('BEGIN');

			for (const item of data) {
				const keys = Object.keys(item);
				const values = Object.values(item);
				const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

				const query = `INSERT INTO ${tableName} (${keys}) VALUES (${placeholders})`;
				await client.query(query, values);
			}

			await client.query('COMMIT');

			console.log(`${tableName} seed completed successfully!`);
		} catch (error) {
			console.error(`Error during ${tableName} seed:`, error);
		} finally {
			client.release();
		}
	};

	seedAll = async () => {
		// Write your seed data here:
		const userData = [
			{
				name: 'John Doe',
				email: 'john@example.com',
				password: bcrypt.hashSync('password', 10),
				role: 'student',
			},
		];

		// Call the seedData method here:
		await this.seedData('users', userData);
	};
}

const seeder = new Seeder();
seeder.seedAll();
