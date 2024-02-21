const Student = require('../models/student');
const Class = require('../models/class');
const CustomError = require('./CustomError');

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

const perfomStudentDeletion = async (id, session) => {
  console.log('id', id);
  const student = await Student.findOne({ _id: id }).session(session);
  await Class.updateOne({ _id: student._class }, { $pull: { students: id } }).session(session);
  await Student.findByIdAndDelete({ _id: id }).session(session);
};

module.exports = { generateUniqueRegNumber, sortStudentsActions, perfomStudentDeletion };
