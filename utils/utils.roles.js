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
    'getCoursesScheme',
    'updateScheme'
  ],
  staff: ['readStudent', 'readStudents', 'updateCourse', 'createClass', 'readClass', 'readCourses', 'createCourse', 'readSingleClass', 'createCourseData', 'updateScheme', 'getCoursesScheme'],
  pupil: ['readStudent', 'readCourses', 'readClass',],
};

module.exports = userRoles;
