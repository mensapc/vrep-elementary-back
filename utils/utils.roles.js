const userRoles = {
  admin: [
    'searchStudent',
    'createStudent',
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
    'updateScheme',
    'getExams',
    'createRole',
    'readRoles',
    'createUserRole',
    'createAdmin',
  ],
  staff: [
    'searchStudent',
    'readStudent',
    'readStudents',
    'updateCourse',
    'createClass',
    'readClass',
    'readCourses',
    'createCourse',
    'readSingleClass',
    'createCourseData',
    'updateScheme',
    'getCoursesScheme',
    'createExam',
    'updateExam',
    'deleteExam',
    'createQuestion',
    'updateQuestion',
    'deleteQuestion',
    'createOption',
    'updateOption',
    'deleteOption',
    'createGrade',
    'createAttendance',
    'createUserRole',
  ],
  pupil: ['readStudent', 'readCourses', 'readClass', 'createAnswer', 'updateAnswer'],
};

module.exports = userRoles;
