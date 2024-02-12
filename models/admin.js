const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
	role: {
		type: String,
		required: true,
		default: 'admin',
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},

	password: {
		type: String,
		required: true,
		trim: true,
	},

	first_name: {
		type: String,
		required: true,
		trim: true,
	},

	last_name: {
		type: String,
		required: true,
		trim: true,
	},

	age: {
		type: Number,
		required: true,
		trim: true,
	},

	phone_number: {
		type: String,
		required: true,
		trim: true,
	},

	address: {
		type: String,
		required: true,
		trim: true,
	},

	photo: {
		type: String,
	},
});

const AdminModel = mongoose.model('Admin', adminSchema);
module.exports = AdminModel;
