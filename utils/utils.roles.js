const userRoles = {
  admin: [
    'createStudent',
    'createStaff',
    'createAdmin',
    'readStudent',
    'updateStudent',
    'deleteStudent',
    'readStudents',
  ],
  staff: ['readStudent', 'readStudents'],
  pupil: ['readStudent'],
};

module.exports = userRoles;
