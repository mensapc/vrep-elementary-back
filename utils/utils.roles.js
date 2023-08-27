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
    'updateStaff',
    'createCourse',
    'readCourse',
    'readCourses',
    'deletecourse',
    'updateCourse',
    'createClass',
    'readClass',
    'readSingleClass'
  ],
  staff: ['readStudent', 'readStudents', 'updateCourse', 'createClass', 'readClass', 'readSingleClass'],
  pupil: ['readStudent'],
};

module.exports = userRoles;
