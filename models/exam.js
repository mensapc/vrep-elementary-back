const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	max_score: {
		type: Number,
		required: true,
	},
	time_limit: {
		type: String,
		required: true,
	},
	start_date: {
		type: String,
		required: true,
	},
	end_date: {
		type: String,
		required: true,
	},
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },
});

const ExamModel = mongoose.model('exams', examSchema);

module.exports = ExamModel;
