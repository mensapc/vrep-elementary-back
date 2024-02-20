const Student = require('../models/student');

function generateRegNumber() {
  const min = 10000000000;
  const max = 99999999999;

  const registrationNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return registrationNumber.toString();
}

// Generate Unique Registration Number
function generateUniqueRegNumber() {
  const regNumber = generateRegNumber();
  return checkStudentRegNumber(regNumber);
}

// Check if Registration Number is Unique
async function checkStudentRegNumber(reg_number) {
  try {
    const student = await Student.findOne({ reg_number });
    if (student) return generateUniqueRegNumber();
    return reg_number;
  } catch (error) {
    throw new Error('Failed to find student by reg number.');
  }
}

module.exports = { generateUniqueRegNumber };
