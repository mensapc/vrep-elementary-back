const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({});

const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade;
