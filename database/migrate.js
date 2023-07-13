const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const schemaPath = path.join(__dirname, 'schema.sql');

async function migrateDatabase() {
	try {
		// Read the schema and seed files
		const schema = fs.readFileSync(schemaPath, 'utf8');

		// Execute schema
		await pool.query(schema);
		console.log('Schema executed successfully!');
	} catch (error) {
		console.error('Error while we run schema :', error);
	}
}

migrateDatabase();
