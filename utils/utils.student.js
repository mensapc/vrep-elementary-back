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

const sortStudentsActions = (sortby) => {
  switch (sortby) {
    case 'age':
      return (sortAction = { age: 1 });
    case 'date':
      return (sortAction = { created_at: -1 });
    case 'name':
      return (sortAction = { first_name: 1 });
    default:
      return (sortAction = { created_at: 1 });
  }
};

module.exports = { generateUniqueRegNumber, sortStudentsActions };
