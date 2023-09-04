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
    'readSingleClass',
    'deleteClass',
    'updateClass',
    'createCourseData',
    'getCoursesScheme'
  ],
  staff: ['readStudent', 'readStudents', 'updateCourse', 'createClass', 'readClass', 'createCourse', 'readSingleClass', 'createCourseData', 'getCoursesScheme'],
  pupil: ['readStudent'],
};

module.exports = userRoles;
