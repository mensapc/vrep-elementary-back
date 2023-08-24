const userRoles = {
  admin: [
    'createStudent',
    'createStudent1',
    'createStaff',
    'createAdmin',
    'readStudent',
    'updateStudent',
    'deleteStudent',
    'readStudents',
    'readStaff',
    'deleteStaff',
    'updateStaff'
  ],
  staff: ['readStudent', 'readStudents'],
  pupil: ['readStudent'],
};

module.exports = userRoles;
