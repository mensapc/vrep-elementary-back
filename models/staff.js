const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
	role: {
		type: String,
		required: true,
		default: 'staff',
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
	allexams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
});

const StaffModel = mongoose.model('Staff', staffSchema);
module.exports = StaffModel;
